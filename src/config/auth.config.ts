import type { SignOptions } from 'jsonwebtoken';

export const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ?? 'development-access-secret-change-me';

export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? 'development-refresh-secret-change-me';

export const JWT_ACCESS_EXPIRES_IN = (process.env.JWT_ACCESS_EXPIRES_IN ??
  '15m') as SignOptions['expiresIn'];

export const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN ??
  '7d') as SignOptions['expiresIn'];
