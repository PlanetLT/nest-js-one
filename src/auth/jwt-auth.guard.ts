import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(
    error: Error | null,
    user: TUser | false,
    info: Error | null,
  ): TUser {
    if (error) {
      throw error;
    }

    if (!user) {
      const message =
        info?.name === 'TokenExpiredError'
          ? 'Access token has expired'
          : 'Please provide a valid access token';

      throw new UnauthorizedException(message);
    }

    return user;
  }
}
