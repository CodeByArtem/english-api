import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { DataSource } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';
import { Role } from '../common/role.enum';
import { Invite } from '../invites/invite.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  // TODO: Add rate limiting (ThrottlerGuard) to prevent brute-forcing invite codes and passwords
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

      return this.generateTokens(user);
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

    return this.generateTokens(user);
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

    return this.generateTokens(user);
  }

  generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'fallback-access-secret',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'fallback-refresh-secret',
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'fallback-refresh-secret',
      });

      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
