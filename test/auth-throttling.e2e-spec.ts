import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import {
  THROTTLE_AUTH_LIMIT,
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
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`should return 429 after exceeding login rate limit (${THROTTLE_AUTH_LIMIT} requests)`, async () => {
    const loginPayload = { email: 'test@example.com', password: 'password123' };

    // Первые THROTTLE_AUTH_LIMIT запросов должны проходить успешно (не 429)
    for (let i = 0; i < THROTTLE_AUTH_LIMIT; i++) {
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
});
