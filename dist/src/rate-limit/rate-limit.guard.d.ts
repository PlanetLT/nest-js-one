import { CanActivate, ExecutionContext, OnModuleDestroy } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class RateLimitGuard implements CanActivate, OnModuleDestroy {
    private readonly reflector;
    private readonly limiter;
    private readonly redisClient;
    constructor(reflector: Reflector);
    onModuleDestroy(): Promise<void>;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
