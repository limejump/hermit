import { Controller, Get } from '@nestjs/common';

@Controller('v1/ready')
export class ReadyController {

  @Get()
  async submitLog() {
    return;
  }
}
