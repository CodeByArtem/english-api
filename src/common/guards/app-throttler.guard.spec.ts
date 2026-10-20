import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerStorage } from '@nestjs/throttler';
import { AppThrottlerGuard } from './app-throttler.guard';

describe('AppThrottlerGuard', () => {
  let guard: AppThrottlerGuard;

  beforeEach(() => {
    const mockOptions = {
      throttlers: [{ ttl: 60000, limit: 10, name: 'default' }],
    };
    const mockStorage = {} as ThrottlerStorage;
    const mockReflector = new Reflector();

    guard = new AppThrottlerGuard(
      mockOptions,
      mockStorage,
      mockReflector,
    );
  });

  const createMockContext = (handlerName: string): ExecutionContext => {
    return {
      getHandler: () => ({ name: handlerName }),
      getClass: () => ({ name: 'AuthController' }),
      switchToHttp: () => ({
        getRequest: () => ({}),
        getResponse: () => ({}),
      }),
    } as unknown as ExecutionContext;
  };

  it('tracks by normalized email when route is login and email is provided', async () => {
    const req = {
      ip: '10.0.0.1',
      path: '/auth/login',
      body: { email: '  Test.User@Example.COM  ' },
    };
    const context = createMockContext('login');

    const tracker = await guard['getTracker'](req, context);
    expect(tracker).toBe('login:test.user@example.com');
  });

  it('tracks by normalized email if matched via path without context', async () => {
    const req = {
      ip: '10.0.0.1',
      path: '/auth/login',
      body: { email: 'student@domain.io' },
    };

    const tracker = await guard['getTracker'](req);
    expect(tracker).toBe('login:student@domain.io');
  });

  it('falls back to IP tracker if email is empty or whitespace on login', async () => {
    const req = {
      ip: '192.168.1.50',
      path: '/auth/login',
      body: { email: '   ' },
    };
    const context = createMockContext('login');

    const tracker = await guard['getTracker'](req, context);
    expect(tracker).toBe('192.168.1.50');
  });

  it('falls back to IP tracker if email is non-string or absent on login', async () => {
    const req = {
      ip: '192.168.1.50',
      path: '/auth/login',
      body: { email: 12345 },
    };
    const context = createMockContext('login');

    const tracker = await guard['getTracker'](req, context);
    expect(tracker).toBe('192.168.1.50');
  });

  it('falls back to IP tracker for non-login routes even if body contains email', async () => {
    const req = {
      ip: '192.168.1.50',
      path: '/auth/register',
      body: { email: 'register@example.com' },
    };
    const context = createMockContext('register');

    const tracker = await guard['getTracker'](req, context);
    expect(tracker).toBe('192.168.1.50');
  });
});
