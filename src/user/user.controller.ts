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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserGuard } from '../common/guards/user.guard';
import { SkipRateLimit } from '../common/decorators/skip-rate-limit.decorator';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';

@Controller('user')
@UseGuards(JwtAuthGuard, UserGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @SkipRateLimit()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  findCurrentUser(@Req() req: AuthenticatedRequest) {
    return this.userService.findCurrentUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    return this.userService.update(updateUserDto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
