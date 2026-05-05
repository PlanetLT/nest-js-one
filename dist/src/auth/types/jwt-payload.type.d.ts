export type JwtPayload = {
    sub: string;
    email: string;
    typ?: 'refresh';
};
export type AuthenticatedUser = {
    userId: string;
    email: string;
};
