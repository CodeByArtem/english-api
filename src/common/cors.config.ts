/**
 * Единый источник разрешённых Origin для CORS и CSRF защиты.
 * Предотвращает расхождения между main.ts (CORS) и AppModule (CsrfGuard).
 */
export const getAllowedOrigins = (frontendUrl?: string): string[] => {
  const envFrontendUrl = frontendUrl || process.env.FRONTEND_URL;
  return [
    envFrontendUrl,
    'http://localhost:3000',
    'http://localhost:3001',
  ]
    .filter((origin): origin is string => Boolean(origin))
    .map((origin) => origin.trim().replace(/\/+$/, ''));
};
