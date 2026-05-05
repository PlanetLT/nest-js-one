import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipRateLimit } from './common/decorators/skip-rate-limit.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SkipRateLimit()
  getHello(): string {
    return this.appService.getHello();
  }
}
