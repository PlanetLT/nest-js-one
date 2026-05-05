import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { PrismaService } from '../../../database/prisma.service';

type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

type UserCreateArgs = {
  data: {
    email: string;
    passwordHash: string;
  };
};

describe('AuthService', () => {
  let service: AuthService;
  let jwt: jest.Mocked<Pick<JwtService, 'signAsync' | 'verifyAsync'>>;
  const prismaMock = {
    user: {
      findUnique: jest.fn<
        Promise<UserRecord | { id: string } | null>,
        [unknown]
      >(),
      findFirst: jest.fn<
        Promise<Pick<UserRecord, 'id' | 'email'> | null>,
        [unknown]
      >(),
      create: jest.fn<Promise<UserRecord>, [UserCreateArgs]>(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jwt = {
      signAsync: jest.fn().mockResolvedValue('signed-token'),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwt },
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('returns access and refresh tokens', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: '019b7d6d-1111-7fff-aaaa-aaaaaaaaaaaa',
        email: 'user@mail.com',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jwt.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.register('User@Mail.com', 'password12');

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      const createArg = prismaMock.user.create.mock.calls[0]?.[0] as {
        data: { email: string };
      };
      expect(createArg.data.email).toBe('user@mail.com');
    });

    it('throws ConflictException when email exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(
        service.register('taken@example.com', 'password12'),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('throws when user unknown', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login('nobody@example.com', 'password12'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('maps expired refresh JWT to Unauthorized with message', async () => {
      jwt.verifyAsync.mockRejectedValue(
        new TokenExpiredError('jwt expired', new Date(0)),
      );

      await expect(service.refreshTokens('dead.refresh')).rejects.toThrow(
        'Refresh token has expired',
      );
    });
  });
});
