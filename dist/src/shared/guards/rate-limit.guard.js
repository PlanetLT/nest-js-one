"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const ioredis_1 = __importDefault(require("ioredis"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const rate_limit_constants_1 = require("./rate-limit.constants");
let RateLimitGuard = class RateLimitGuard {
    reflector;
    limiter;
    redisClient;
    constructor(reflector) {
        this.reflector = reflector;
        const points = Number(process.env.RATE_LIMIT_POINTS ?? 10);
        const duration = Number(process.env.RATE_LIMIT_DURATION ?? 60);
        const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';
        this.redisClient = new ioredis_1.default(redisUrl, {
            enableOfflineQueue: false,
        });
        this.limiter = new rate_limiter_flexible_1.RateLimiterRedis({
            storeClient: this.redisClient,
            keyPrefix: 'global_api_rate_limit',
            points,
            duration,
        });
    }
    async onModuleDestroy() {
        await this.redisClient.quit();
    }
    async canActivate(context) {
        const shouldSkip = this.reflector.getAllAndOverride(rate_limit_constants_1.SKIP_RATE_LIMIT_KEY, [context.getHandler(), context.getClass()]);
        if (shouldSkip) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const ip = request.ip ?? 'unknown-ip';
        const method = request.method ?? 'unknown-method';
        const route = request.originalUrl ?? 'unknown-route';
        const key = `${ip}:${method}:${route}`;
        try {
            await this.limiter.consume(key);
            return true;
        }
        catch (error) {
            const msBeforeNext = error && typeof error === 'object' && 'msBeforeNext' in error
                ? Number(error.msBeforeNext)
                : 0;
            const retryAfter = Math.max(1, Math.ceil(msBeforeNext / 1000));
            throw new common_1.HttpException({
                message: 'Too many requests',
                retryAfterSeconds: retryAfter,
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map