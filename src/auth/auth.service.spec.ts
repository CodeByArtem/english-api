import { AuthService } from './auth.service';
import { Role } from '../common/role.enum';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('AuthService - Registration & Invites', () => {
  let authService: AuthService;
  let mockUsersService: any;
  let mockJwtService: any;
  let mockConfigService: any;
  let mockDataSource: any;
  let mockEntityManager: any;

  beforeEach(() => {
    mockUsersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    };
    mockConfigService = {
      get: jest.fn().mockReturnValue('secret'),
    };
    mockEntityManager = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    mockDataSource = {
      transaction: jest.fn().mockImplementation((cb) => cb(mockEntityManager)),
    };

    authService = new AuthService(
      mockUsersService,
      mockJwtService,
      mockConfigService,
      mockDataSource,
    );
  });

  it('should register student when no inviteCode is provided', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue({
      id: 'user-1',
      email: 'student@test.com',
      role: Role.STUDENT,
    });

    const result = await authService.register({
      email: 'student@test.com',
      password: 'password123',
    });

    expect(mockUsersService.create).toHaveBeenCalledWith(
      'student@test.com',
      'password123',
      Role.STUDENT,
    );
    expect(result.accessToken).toBe('mock-token');
  });

  it('should register tutor and mark invite as used when valid inviteCode is provided', async () => {
    const rawCode = 'valid-invite-code';
    const hash = crypto.createHash('sha256').update(rawCode).digest('hex');
    const invite = {
      id: 'inv-1',
      tokenHash: hash,
      role: Role.TUTOR,
      expiresAt: new Date(Date.now() + 100000),
      usedAt: null,
    };

    mockEntityManager.findOne
      .mockResolvedValueOnce(invite) // invite lookup
      .mockResolvedValueOnce(null);  // email lookup
    mockEntityManager.create.mockReturnValue({
      id: 'user-2',
      email: 'tutor@test.com',
      role: Role.TUTOR,
    });
    mockEntityManager.save.mockImplementation((entityClass: any, entity: any) =>
      Promise.resolve(entity),
    );

    const result = await authService.register({
      email: 'tutor@test.com',
      password: 'password123',
      inviteCode: rawCode,
    });

    expect(invite.usedAt).toBeInstanceOf(Date);
    expect(mockEntityManager.save).toHaveBeenCalledWith(expect.anything(), invite);
    expect(result.accessToken).toBe('mock-token');
  });

  it('should reject registration when inviteCode does not exist', async () => {
    mockEntityManager.findOne.mockResolvedValueOnce(null);

    await expect(
      authService.register({
        email: 'tutor@test.com',
        password: 'password123',
        inviteCode: 'nonexistent-code',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject registration when inviteCode was already used', async () => {
    const invite = {
      id: 'inv-1',
      usedAt: new Date(),
      expiresAt: new Date(Date.now() + 100000),
    };
    mockEntityManager.findOne.mockResolvedValueOnce(invite);

    await expect(
      authService.register({
        email: 'tutor@test.com',
        password: 'password123',
        inviteCode: 'already-used',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject registration when inviteCode is expired', async () => {
    const invite = {
      id: 'inv-1',
      usedAt: null,
      expiresAt: new Date(Date.now() - 100000),
    };
    mockEntityManager.findOne.mockResolvedValueOnce(invite);

    await expect(
      authService.register({
        email: 'tutor@test.com',
        password: 'password123',
        inviteCode: 'expired-code',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should ignore role in request body and register student when no inviteCode is provided', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue({
      id: 'user-3',
      email: 'student@test.com',
      role: Role.STUDENT,
    });

    const result = await authService.register({
      email: 'student@test.com',
      password: 'password123',
      role: Role.TUTOR,
    } as any);

    expect(mockUsersService.create).toHaveBeenCalledWith(
      'student@test.com',
      'password123',
      Role.STUDENT,
    );
    expect(result.accessToken).toBe('mock-token');
  });
});
