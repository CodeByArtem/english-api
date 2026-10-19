import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

// Методы, изменяющие состояние — именно их нужно защищать от CSRF.
// GET, HEAD, OPTIONS считаются «безопасными» (RFC 7231) и не проверяются.
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const normalizeOrigin = (url: string): string => url.trim().replace(/\/+$/, '');

@Injectable()
export class CsrfGuard implements CanActivate {
  private readonly allowedOriginsSet: Set<string>;

  constructor(allowedOrigins: string[]) {
    this.allowedOriginsSet = new Set(
      allowedOrigins
        .filter((origin): origin is string => Boolean(origin))
        .map(normalizeOrigin),
    );
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    // Безопасные методы пропускаем без проверки
    if (!UNSAFE_METHODS.has(req.method.toUpperCase())) {
      return true;
    }

    // Мобильные клиенты аутентифицируются через Bearer — CSRF им не страшен,
    // потому что браузер не может автоматически подставить Authorization-заголовок.
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return true;
    }

    // Проверяем наличие auth-cookie (accessToken или refreshToken).
    // Без cookie запрос пропускается: CSRF-атака невозможна без ambient credentials.
    // Это позволяет мобильным клиентам и гостям выполнять login/register без заголовка Origin.
    const cookies = req.cookies as Record<string, string> | undefined;
    const hasAuthCookie = Boolean(cookies?.accessToken || cookies?.refreshToken);
    if (!hasAuthCookie) {
      return true;
    }

    // Для cookie-аутентификации проверяем Origin (приоритет) или Referer (запасной вариант).
    const originHeader = req.headers['origin'];
    const refererHeader = req.headers['referer'];

    let sourceOrigin: string | null = null;

    if (typeof originHeader === 'string' && originHeader.trim() !== '') {
      sourceOrigin = normalizeOrigin(originHeader);
    } else if (typeof refererHeader === 'string' && refererHeader.trim() !== '') {
      try {
        sourceOrigin = normalizeOrigin(new URL(refererHeader).origin);
      } catch {
        sourceOrigin = null;
      }
    }

    if (!sourceOrigin || !this.allowedOriginsSet.has(sourceOrigin)) {
      throw new ForbiddenException('CSRF check failed: origin not allowed');
    }

    return true;
  }
}
