import { Controller, Post, Body, UseFilters, Injectable } from '@nestjs/common';
import { StructuredLogService } from '../services/structured-log.service';
import { StructuredLogDto } from '../dtos/structured-log';

@Controller('v1/structured')
export class StructuredLogController {
  constructor(private readonly structuredLogService: StructuredLogService) {}

  @Post()
  async submitLog(@Body() logs: StructuredLogDto[]) {
    this.structuredLogService.sendLogs(logs);
  }
}
