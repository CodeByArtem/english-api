import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '../common/role.enum';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/user.entity';

describe('AuthService - Refresh Token & Reuse Detection', () => {
  let authService: AuthService;
  let mockUsersService: any;
  let mockJwtService: any;
  let mockConfigService: any;
  let mockDataSource: any;
  let mockEntityManager: any;
  let mockRefreshTokenRepository: any;

  const mockUser: User = {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    role: Role.STUDENT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockUsersService = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      create: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mocked.jwt.token'),
      verify: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return 'test-access-secret';
        if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
        return null;
      }),
    };

    const mockQueryBuilder = {
      delete: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    mockEntityManager = {
      create: jest.fn((entity, data) => ({ ...data })),
      save: jest.fn((entity, data) => Promise.resolve(data)),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockRefreshTokenRepository = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockDataSource = {
      transaction: jest.fn((cb) => cb(mockEntityManager)),
      getRepository: jest.fn().mockReturnValue(mockRefreshTokenRepository),
    };

    authService = new AuthService(
      mockUsersService,
      mockJwtService,
      mockConfigService,
      mockDataSource,
    );
  });

  describe('createTokenFamily', () => {
    it('should create new family and issue tokens', async () => {
      const tokens = await authService.createTokenFamily(mockUser);

      expect(tokens.accessToken).toBe('mocked.jwt.token');
      expect(tokens.refreshToken).toBe('mocked.jwt.token');
      expect(mockEntityManager.create).toHaveBeenCalledWith(
        RefreshToken,
        expect.objectContaining({
          userId: mockUser.id,
          familyId: expect.any(String),
          tokenHash: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      );
      expect(mockEntityManager.save).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    it('should successfully rotate refresh token on normal refresh', async () => {
      const familyId = '22222222-2222-2222-2222-222222222222';
      const existingToken: RefreshToken = {
        id: '33333333-3333-3333-3333-333333333333',
        userId: mockUser.id,
        user: mockUser,
        familyId,
        tokenHash: 'somehash',
        expiresAt: new Date(Date.now() + 100000),
        usedAt: null,
        revokedAt: null,
        replacedById: null,
        clientType: 'web',
        createdAt: new Date(),
      };

      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        jti: existingToken.id,
        familyId,
      });

      // Первый findOne ищет токен по tokenHash с блокировкой
      // Второй findOne ищет пользователя по userId
      mockEntityManager.findOne
        .mockResolvedValueOnce(existingToken)
        .mockResolvedValueOnce(mockUser);

      const tokens = await authService.refreshTokens('valid.refresh.token');

      expect(tokens.accessToken).toBe('mocked.jwt.token');
      expect(tokens.refreshToken).toBe('mocked.jwt.token');
      expect(existingToken.usedAt).toBeInstanceOf(Date);
      expect(existingToken.replacedById).toBeDefined();
      expect(mockEntityManager.save).toHaveBeenCalledWith(RefreshToken, existingToken);
    });

    it('should detect reuse outside grace period, revoke family in DB, and throw 401', async () => {
      const familyId = '22222222-2222-2222-2222-222222222222';
      const existingToken: RefreshToken = {
        id: '33333333-3333-3333-3333-333333333333',
        userId: mockUser.id,
        user: mockUser,
        familyId,
        tokenHash: 'somehash',
        expiresAt: new Date(Date.now() + 100000),
        usedAt: new Date(Date.now() - 30_000), // 30 секунд назад (вне окна 20 сек)
        revokedAt: null,
        replacedById: '44444444-4444-4444-4444-444444444444',
        clientType: 'web',
        createdAt: new Date(),
      };

      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        jti: existingToken.id,
        familyId,
      });

      mockEntityManager.findOne
        .mockResolvedValueOnce(existingToken)
        .mockResolvedValueOnce(mockUser);

      const updateSpy = jest.fn().mockReturnThis();
      const setSpy = jest.fn().mockReturnThis();
      const whereSpy = jest.fn().mockReturnThis();
      const executeSpy = jest.fn().mockResolvedValue({ affected: 2 });

      mockEntityManager.createQueryBuilder.mockReturnValue({
        update: updateSpy,
        set: setSpy,
        where: whereSpy,
        execute: executeSpy,
      });

      await expect(
        authService.refreshTokens('reused.refresh.token'),
      ).rejects.toThrow(new UnauthorizedException('Token reuse detected'));

      // Проверяем, что внутри транзакции был выполнен отзыв всего семейства
      expect(updateSpy).toHaveBeenCalledWith(RefreshToken);
      expect(setSpy).toHaveBeenCalledWith(expect.objectContaining({ revokedAt: expect.any(Date) }));
      expect(whereSpy).toHaveBeenCalledWith(
        'family_id = :familyId AND revoked_at IS NULL',
        { familyId },
      );
      expect(executeSpy).toHaveBeenCalled();
    });

    it('should allow reuse inside grace period without revoking family', async () => {
      const familyId = '22222222-2222-2222-2222-222222222222';
      const existingToken: RefreshToken = {
        id: '33333333-3333-3333-3333-333333333333',
        userId: mockUser.id,
        user: mockUser,
        familyId,
        tokenHash: 'somehash',
        expiresAt: new Date(Date.now() + 100000),
        usedAt: new Date(Date.now() - 5_000), // 5 секунд назад (внутри окна 20 сек)
        revokedAt: null,
        replacedById: '44444444-4444-4444-4444-444444444444',
        clientType: 'web',
        createdAt: new Date(),
      };

      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        jti: existingToken.id,
        familyId,
      });

      mockEntityManager.findOne
        .mockResolvedValueOnce(existingToken)
        .mockResolvedValueOnce(mockUser);

      const tokens = await authService.refreshTokens('grace.refresh.token');

      expect(tokens.accessToken).toBe('mocked.jwt.token');
      expect(tokens.refreshToken).toBe('mocked.jwt.token');
      // В окне прощения отзыв семейства не вызывается
      expect(mockEntityManager.createQueryBuilder().update).not.toHaveBeenCalled();
    });

    it('should reject already revoked token with 401', async () => {
      const familyId = '22222222-2222-2222-2222-222222222222';
      const revokedToken: RefreshToken = {
        id: '33333333-3333-3333-3333-333333333333',
        userId: mockUser.id,
        user: mockUser,
        familyId,
        tokenHash: 'somehash',
        expiresAt: new Date(Date.now() + 100000),
        usedAt: null,
        revokedAt: new Date(),
        replacedById: null,
        clientType: 'web',
        createdAt: new Date(),
      };

      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        jti: revokedToken.id,
        familyId,
      });

      mockEntityManager.findOne.mockResolvedValueOnce(revokedToken);

      await expect(
        authService.refreshTokens('revoked.token'),
      ).rejects.toThrow(new UnauthorizedException('Token revoked'));
    });

    it('should reject token not found in database with 401', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        jti: 'unknown-jti',
        familyId: 'unknown-family',
      });

      mockEntityManager.findOne.mockResolvedValueOnce(null);

      await expect(
        authService.refreshTokens('unknown.token'),
      ).rejects.toThrow(new UnauthorizedException('Invalid or expired refresh token'));
    });

    it('should reject legacy token without jti or familyId with 401', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        // нет jti и familyId
      });

      await expect(
        authService.refreshTokens('legacy.token'),
      ).rejects.toThrow(new UnauthorizedException('Invalid or expired refresh token'));
    });

    it('should reject token when JWT verification fails with 401', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(
        authService.refreshTokens('expired.jwt.token'),
      ).rejects.toThrow(new UnauthorizedException('Invalid or expired refresh token'));
    });
  });

  describe('revokeFamily (logout)', () => {
    it('should revoke all family tokens when valid token provided', async () => {
      const familyId = '22222222-2222-2222-2222-222222222222';
      const existingToken: RefreshToken = {
        id: '33333333-3333-3333-3333-333333333333',
        userId: mockUser.id,
        user: mockUser,
        familyId,
        tokenHash: 'somehash',
        expiresAt: new Date(Date.now() + 100000),
        usedAt: null,
        revokedAt: null,
        replacedById: null,
        clientType: 'web',
        createdAt: new Date(),
      };

      mockJwtService.verify.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        jti: existingToken.id,
        familyId,
      });

      mockRefreshTokenRepository.findOne.mockResolvedValue(existingToken);

      await authService.revokeFamily('logout.token');

      expect(mockRefreshTokenRepository.createQueryBuilder().update).toHaveBeenCalledWith(RefreshToken);
      expect(mockRefreshTokenRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        'family_id = :familyId AND revoked_at IS NULL',
        { familyId },
      );
    });

    it('should not throw error if token is invalid or expired on logout', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('invalid signature');
      });

      await expect(authService.revokeFamily('corrupted.token')).resolves.toBeUndefined();
    });
  });
});
