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
import { SkipRateLimit } from '../../../common/decorators/skip-rate-limit.decorator';
import type { AuthenticatedRequest } from '../../../common/types/authenticated-request.type';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfilesGuard } from '../guards/profiles.guard';
import { ProfilesService } from '../services/profiles.service';

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
