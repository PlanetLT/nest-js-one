import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { SKIP_RATE_LIMIT_KEY } from './rate-limit.constants';

@Injectable()
export class RateLimitGuard implements CanActivate, OnModuleDestroy {
  private readonly limiter: RateLimiterRedis;
  private readonly redisClient: Redis;

  constructor(private readonly reflector: Reflector) {
    const points = Number(process.env.RATE_LIMIT_POINTS ?? 10);
    const duration = Number(process.env.RATE_LIMIT_DURATION ?? 60);
    const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';

    this.redisClient = new Redis(redisUrl, {
      enableOfflineQueue: false,
    });

    this.limiter = new RateLimiterRedis({
      storeClient: this.redisClient,
      keyPrefix: 'global_api_rate_limit',
      points,
      duration,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.redisClient.quit();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const shouldSkip = this.reflector.getAllAndOverride<boolean>(
      SKIP_RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (shouldSkip) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      ip?: string;
      method?: string;
      originalUrl?: string;
    }>();
    const ip = request.ip ?? 'unknown-ip';
    const method = request.method ?? 'unknown-method';
    const route = request.originalUrl ?? 'unknown-route';
    const key = `${ip}:${method}:${route}`;

    try {
      await this.limiter.consume(key);
      return true;
    } catch (error) {
      const msBeforeNext =
        error && typeof error === 'object' && 'msBeforeNext' in error
          ? Number((error as { msBeforeNext: number }).msBeforeNext)
          : 0;
      const retryAfter = Math.max(1, Math.ceil(msBeforeNext / 1000));

      throw new HttpException(
        {
          message: 'Too many requests',
          retryAfterSeconds: retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
