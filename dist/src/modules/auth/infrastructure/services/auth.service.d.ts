import { JwtService } from '@nestjs/jwt';
import { type PrismaClient } from '@prisma/client';
type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaClient, jwtService: JwtService);
    register(email: string, rawPassword: string): Promise<AuthTokens>;
    login(email: string, rawPassword: string): Promise<AuthTokens>;
    refreshTokens(refreshToken: string): Promise<AuthTokens>;
    private issueTokens;
}
export {};
