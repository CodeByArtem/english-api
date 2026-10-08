import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { DataSource, EntityManager } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';
import { Role } from '../common/role.enum';
import { Invite } from '../invites/invite.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import {
  REFRESH_GRACE_PERIOD_MS,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_MAX_AGE_MS,
} from './refresh.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async register(registerDto: RegisterDto) {
    if (!registerDto.inviteCode) {
      const existingUser = await this.usersService.findByEmail(
        registerDto.email,
      );
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }

      const user = await this.usersService.create(
        registerDto.email,
        registerDto.password,
        Role.STUDENT,
      );

      return this.createTokenFamily(user);
    }

    const codeHash = crypto
      .createHash('sha256')
      .update(registerDto.inviteCode)
      .digest('hex');

    const user = await this.dataSource.transaction(async (manager) => {
      const invite = await manager.findOne(Invite, {
        where: { tokenHash: codeHash },
      });

      if (!invite || invite.usedAt !== null || invite.expiresAt <= new Date()) {
        throw new BadRequestException('Invalid invite code');
      }

      const existingUser = await manager.findOne(User, {
        where: { email: registerDto.email },
      });
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }

      const passwordHash = await bcrypt.hash(registerDto.password, 10);
      const newUser = manager.create(User, {
        email: registerDto.email,
        passwordHash,
        role: invite.role,
      });
      const savedUser = await manager.save(User, newUser);

      invite.usedAt = new Date();
      await manager.save(Invite, invite);

      return savedUser;
    });

    return this.createTokenFamily(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createTokenFamily(user);
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async issueTokens(
    user: User,
    familyId: string,
    manager: EntityManager,
    clientType: string | null = null,
  ) {
    const jti = crypto.randomUUID();
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'fallback-access-secret',
    });

    const refreshToken = this.jwtService.sign(
      { ...payload, jti, familyId },
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'fallback-refresh-secret',
      },
    );

    const tokenRecord = manager.create(RefreshToken, {
      id: jti,
      userId: user.id,
      familyId,
      tokenHash: this.hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE_MS),
      clientType,
    });
    await manager.save(RefreshToken, tokenRecord);

    return { accessToken, refreshToken, jti };
  }

  async createTokenFamily(user: User, customManager?: EntityManager) {
    const familyId = crypto.randomUUID();
    const runner = async (manager: EntityManager) => {
      const tokens = await this.issueTokens(user, familyId, manager);
      // Удаляем просроченные записи пользователя при логине
      await manager
        .createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where('user_id = :userId AND expires_at < :now', {
          userId: user.id,
          now: new Date(),
        })
        .execute();

      return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    };

    if (customManager) {
      return runner(customManager);
    }
    return this.dataSource.transaction(runner);
  }

  async refreshTokens(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'fallback-refresh-secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!payload.jti || !payload.familyId) {
      // Токен старого формата (без jti и familyId)
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokenHash = this.hashToken(refreshToken);

    // Выполняем транзакцию с блокировкой строки
    const result = await this.dataSource.transaction(async (manager) => {
      // Блокировка строки без JOIN (FOR UPDATE в Postgres несовместим с LEFT JOIN)
      const tokenRecord = await manager.findOne(RefreshToken, {
        where: { tokenHash },
        lock: { mode: 'pessimistic_write' },
      });

      if (!tokenRecord) {
        return { status: 'NOT_FOUND' as const };
      }

      if (tokenRecord.revokedAt) {
        return { status: 'REVOKED' as const };
      }

      // Загружаем пользователя отдельным запросом внутри той же транзакции
      const user = await manager.findOne(User, {
        where: { id: tokenRecord.userId },
      });
      if (!user) {
        return { status: 'NOT_FOUND' as const };
      }

      if (tokenRecord.usedAt) {
        const elapsed = Date.now() - tokenRecord.usedAt.getTime();
        if (elapsed > REFRESH_GRACE_PERIOD_MS) {
          // Повтор вне окна прощения: отзываем семейство внутри транзакции
          await manager
            .createQueryBuilder()
            .update(RefreshToken)
            .set({ revokedAt: new Date() })
            .where('family_id = :familyId AND revoked_at IS NULL', {
              familyId: tokenRecord.familyId,
            })
            .execute();

          // Завершаем транзакцию успешно, зафиксировав отзыв
          return { status: 'REUSE_DETECTED' as const };
        }

        // Повтор внутри окна прощения: выдаём новый токен без отзыва
        const newTokens = await this.issueTokens(
          user,
          tokenRecord.familyId,
          manager,
          tokenRecord.clientType,
        );
        return {
          status: 'SUCCESS' as const,
          tokens: { accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken },
        };
      }

      // Обычная ротация: токен ещё не использовался
      const newTokens = await this.issueTokens(
        user,
        tokenRecord.familyId,
        manager,
        tokenRecord.clientType,
      );

      tokenRecord.usedAt = new Date();
      tokenRecord.replacedById = newTokens.jti;
      await manager.save(RefreshToken, tokenRecord);

      // Очистка просроченных токенов пользователя (явные имена колонок)
      await manager
        .createQueryBuilder()
        .delete()
        .from(RefreshToken)
        .where('user_id = :userId AND expires_at < :now', {
          userId: user.id,
          now: new Date(),
        })
        .execute();

      return {
        status: 'SUCCESS' as const,
        tokens: { accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken },
      };
    });

    // 401 выбрасывается ПОСЛЕ коммита транзакции
    if (result.status === 'NOT_FOUND') {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    if (result.status === 'REVOKED') {
      throw new UnauthorizedException('Token revoked');
    }
    if (result.status === 'REUSE_DETECTED') {
      throw new UnauthorizedException('Token reuse detected');
    }

    return result.tokens;
  }

  async revokeFamily(refreshToken: string): Promise<void> {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'fallback-refresh-secret',
      });

      const tokenHash = this.hashToken(refreshToken);
      const tokenRecord = await this.dataSource.getRepository(RefreshToken).findOne({
        where: { tokenHash },
      });

      if (tokenRecord) {
        await this.dataSource
          .getRepository(RefreshToken)
          .createQueryBuilder()
          .update(RefreshToken)
          .set({ revokedAt: new Date() })
          .where('family_id = :familyId AND revoked_at IS NULL', {
            familyId: tokenRecord.familyId,
          })
          .execute();
      }
    } catch {
      // Logout не должен падать при невалидном токене
    }
  }
}
