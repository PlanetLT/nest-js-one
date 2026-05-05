import type { Request } from 'express';
import type { AuthenticatedUser } from './jwt-payload.type';
export type AuthenticatedRequest = Request & {
    user: AuthenticatedUser;
};
