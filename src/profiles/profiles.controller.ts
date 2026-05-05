import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfilesGuard } from './profiles.guard';
import { SkipRateLimit } from '../rate-limit/skip-rate-limit.decorator';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';

@Controller('profiles')
@UseGuards(JwtAuthGuard, ProfilesGuard)
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}
  @Get()
  @SkipRateLimit()
  findAll() {
    return this.profileService.findAll();
  }

  @Get('me')
  findCurrentUser(@Req() req: AuthenticatedRequest) {
    return this.profileService.findCurrentUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Put(':id')
  update(@Body() updateProfileDto: UpdateProfileDto, @Param('id') id: string) {
    return this.profileService.update(updateProfileDto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.profileService.delete(id);
  }
}
