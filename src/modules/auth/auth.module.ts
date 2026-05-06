import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET,
} from '../../config/auth.config';
import { AuthService } from './infrastructure/services/auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
