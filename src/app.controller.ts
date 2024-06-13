import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('Hello, World!')
  @ApiOperation({ summary: 'Hello, World!' })
  getHello(): string {
    return this.appService.getHello();
  }
}
