import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Кастомный ThrottlerGuard для защиты от брутфорса авторизации.
 *
 * Проблема: В продакшене на Render приложение работает за обратным прокси/балансировщиком,
 * поэтому req.ip одинаковый (внутренний IP Render) для всех пользователей.
 * При стандартном троттлинге по IP превышение лимита одним пользователем блокировало всех остальных.
 *
 * Решение: Для эндпоинта /auth/login трекер привязывается к email (req.body.email).
 * Это обеспечивает изолированный счетчик попыток для каждой учетной записи и защищает
 * от блокировки остальных учеников. Для остальных маршрутов используется стандартный IP-трекер.
 */
@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(
    req: Record<string, any>,
    context?: ExecutionContext,
  ): Promise<string> {
    const isLogin =
      context?.getHandler?.()?.name === 'login' ||
      req.path === '/auth/login' ||
      req.originalUrl?.includes('/auth/login');

    if (isLogin && typeof req.body?.email === 'string') {
      const email = req.body.email.trim().toLowerCase();
      if (email) {
        return `login:${email}`;
      }
    }

    return super.getTracker(req);
  }
}
