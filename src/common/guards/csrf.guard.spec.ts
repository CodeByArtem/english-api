import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CsrfGuard } from './csrf.guard';

describe('CsrfGuard', () => {
  let guard: CsrfGuard;
  const allowedOrigins = [
    'https://english-front-seven.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  beforeEach(() => {
    guard = new CsrfGuard(allowedOrigins);
  });

  const createMockContext = (
    method: string,
    options: {
      headers?: Record<string, string | undefined>;
      cookies?: Record<string, string | undefined>;
    } = {},
  ): ExecutionContext => {
    const req = {
      method,
      headers: options.headers || {},
      cookies: options.cookies || {},
    };

    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;
  };

  it('allows safe methods (GET, HEAD, OPTIONS) without origin or cookie check', () => {
    expect(guard.canActivate(createMockContext('GET'))).toBe(true);
    expect(guard.canActivate(createMockContext('HEAD'))).toBe(true);
    expect(guard.canActivate(createMockContext('OPTIONS'))).toBe(true);
  });

  it('allows unsafe methods when no auth cookies are present (mobile login / guest)', () => {
    // Без accessToken / refreshToken запрос считается неаутентифицированным через cookies
    const context = createMockContext('POST', {
      headers: {},
      cookies: {},
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows requests with Bearer token (mobile clients) even with unknown Origin', () => {
    const context = createMockContext('POST', {
      headers: {
        authorization: 'Bearer some-mobile-jwt-token',
        origin: 'https://untrusted-mobile-origin.com',
      },
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows unsafe methods with auth-cookie when Origin matches allowedOrigins', () => {
    const context = createMockContext('POST', {
      headers: {
        origin: 'https://english-front-seven.vercel.app',
      },
      cookies: {
        accessToken: 'valid-jwt-token',
      },
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows unsafe methods with refreshToken cookie and valid Origin', () => {
    const context = createMockContext('POST', {
      headers: {
        origin: 'https://english-front-seven.vercel.app',
      },
      cookies: {
        refreshToken: 'valid-refresh-token',
      },
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('handles trailing slashes in Origin', () => {
    const context = createMockContext('POST', {
      headers: {
        origin: 'https://english-front-seven.vercel.app/',
      },
      cookies: {
        accessToken: 'valid-jwt-token',
      },
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows unsafe methods with auth-cookie when Origin is missing but Referer matches', () => {
    const context = createMockContext('POST', {
      headers: {
        referer: 'https://english-front-seven.vercel.app/lessons/1',
      },
      cookies: {
        accessToken: 'valid-jwt-token',
      },
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects unsafe methods with auth-cookie when Origin is untrusted', () => {
    const context = createMockContext('POST', {
      headers: {
        origin: 'https://evil-attacker.com',
      },
      cookies: {
        accessToken: 'valid-jwt-token',
      },
    });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('rejects unsafe methods with auth-cookie when neither Origin nor Referer is provided', () => {
    const context = createMockContext('POST', {
      headers: {},
      cookies: {
        accessToken: 'valid-jwt-token',
      },
    });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('rejects unsafe methods with auth-cookie when Referer is malformed', () => {
    const context = createMockContext('POST', {
      headers: {
        referer: 'invalid-url-string',
      },
      cookies: {
        accessToken: 'valid-jwt-token',
      },
    });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
