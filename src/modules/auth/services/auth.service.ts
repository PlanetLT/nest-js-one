import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, type PrismaClient } from '@prisma/client';
import { TokenExpiredError } from 'jsonwebtoken';
import { PrismaService } from '../../../database/prisma.service';
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
} from '../../../config/auth.config';
import type { JwtPayload } from '../../../common/types/jwt-payload.type';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, rawPassword: string): Promise<AuthTokens> {
    const normalized = email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({
      where: { email: normalized },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: normalized,
          passwordHash,
        },
      });
      return this.issueTokens(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }

  async login(email: string, rawPassword: string): Promise<AuthTokens> {
    const normalized = email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email: normalized },
    });
    const valid =
      user && (await bcrypt.compare(rawPassword, user.passwordHash));
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.issueTokens(user);
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        { secret: JWT_REFRESH_SECRET },
      );

      if (payload.typ !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const normalized = payload.email.toLowerCase().trim();
      const user = await this.prisma.user.findFirst({
        where: {
          id: payload.sub,
          email: normalized,
        },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.issueTokens(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token has expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async issueTokens(user: {
    id: string;
    email: string;
  }): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: JWT_ACCESS_SECRET,
        expiresIn: JWT_ACCESS_EXPIRES_IN,
      }),
      this.jwtService.signAsync(
        { ...payload, typ: 'refresh' } satisfies JwtPayload,
        {
          secret: JWT_REFRESH_SECRET,
          expiresIn: JWT_REFRESH_EXPIRES_IN,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
