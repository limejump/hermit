import { Controller, Get, Logger } from '@nestjs/common';

@Controller('v1/ready')
export class ReadyController {
  private readonly logger = new Logger('Ready Controller');

  @Get()
  async get() {
    this.logger.log('/ready')
    return;
  }
}
