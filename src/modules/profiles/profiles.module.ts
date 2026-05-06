import { Module } from '@nestjs/common';
import { ProfilesService } from './infrastructure/services/profiles.service';
import { ProfilesController } from './presentation/controllers/profiles.controller';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
