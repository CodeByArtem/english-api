import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { AppThrottlerGuard } from '../src/common/guards/app-throttler.guard';
import {
  THROTTLE_LOGIN_LIMIT,
  THROTTLE_TTL,
  THROTTLE_GLOBAL_LIMIT,
  THROTTLE_ERROR_MESSAGE,
} from '../src/auth/throttle.constants';

describe('Auth Throttling (e2e)', () => {
  let app: INestApplication;

  const mockAuthService = {
    login: () =>
      Promise.resolve({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }),
    register: () =>
      Promise.resolve({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }),
    refreshTokens: () =>
      Promise.resolve({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          throttlers: [
            {
              ttl: THROTTLE_TTL,
              limit: THROTTLE_GLOBAL_LIMIT,
            },
          ],
          errorMessage: THROTTLE_ERROR_MESSAGE,
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: APP_GUARD,
          useClass: AppThrottlerGuard,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`should return 429 after exceeding login rate limit (${THROTTLE_LOGIN_LIMIT} requests)`, async () => {
    const loginPayload = { email: 'test@example.com', password: 'password123' };

    // Первые THROTTLE_LOGIN_LIMIT запросов должны проходить успешно (не 429)
    for (let i = 0; i < THROTTLE_LOGIN_LIMIT; i++) {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginPayload);
      expect(res.status).not.toBe(429);
    }

    // Запрос после исчерпания лимита должен вернуть 429 Too Many Requests
    const blockedRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginPayload);

    expect(blockedRes.status).toBe(429);
    expect(blockedRes.body.message).toBe(THROTTLE_ERROR_MESSAGE);
  });

  it('should not block a different email when one email exceeds login rate limit', async () => {
    const attackedEmail = 'victim@example.com';
    const innocentEmail = 'innocent@example.com';

    for (let i = 0; i < THROTTLE_LOGIN_LIMIT; i++) {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: attackedEmail, password: 'wrong-password' });
      expect(res.status).not.toBe(429);
    }

    const blockedRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: attackedEmail, password: 'wrong-password' });
    expect(blockedRes.status).toBe(429);

    // Другой email с того же клиента/IP не должен блокироваться
    const innocentRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: innocentEmail, password: 'password123' });
    expect(innocentRes.status).not.toBe(429);
  });
});
