import { Controller, Post, Body, Logger } from '@nestjs/common';
import { UnstructuredLogDto } from '../dtos/unstructured-log';
import { UnstructuredLogService } from '../services/unstructured-log.service';

@Controller('v1/unstructured')
export class UnstructuredLogController {
  private readonly logger = new Logger('Unstructured Log Controller')
  constructor(
    private readonly unstructuredLogService: UnstructuredLogService,
  ) { }

  @Post()
  async submitLog(@Body() logs: UnstructuredLogDto) {
    this.logger.log('POST /v1/unstructured/', logs.toString());
    this.unstructuredLogService.sendLogs(logs);
  }
}
