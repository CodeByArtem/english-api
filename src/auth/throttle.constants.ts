export const THROTTLE_TTL = 60_000; // 1 минута в миллисекундах
export const THROTTLE_GLOBAL_LIMIT = 300; // 300 запросов в минуту глобально (с запасом для пользователей за общим IP)
export const THROTTLE_AUTH_LIMIT = 10; // 10 запросов в минуту на login и register
export const THROTTLE_REFRESH_LIMIT = 60; // 60 запросов в минуту на refresh
export const THROTTLE_ERROR_MESSAGE = 'Too many requests, please try again later';
