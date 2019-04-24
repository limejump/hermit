import { Controller, Post, Body, Logger } from '@nestjs/common';
import { StructuredLogService } from '../services/structured-log.service';
import { StructuredLogDto } from '../dtos/structured-log';

@Controller('v1/structured')
export class StructuredLogController {
  private readonly logger = new Logger('Structured Log Controller')

  constructor(private readonly structuredLogService: StructuredLogService) { }

  @Post()
  async submitLog(@Body() logs: StructuredLogDto[]) {
    this.logger.log('POST /v1/structured', logs.toString());
    this.structuredLogService.sendLogs(logs);
  }
}
