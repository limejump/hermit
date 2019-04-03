import { Injectable, HttpServer, HttpService } from '@nestjs/common';
import { StructuredLogDto } from '../dtos/structured-log';

@Injectable()
export class StructuredLogService {
  constructor(private readonly httpService: HttpService) {}

  async sendLogs(logs: StructuredLogDto[]): Promise<boolean> {
    try {
      const response = await this.httpService
        .post('/api/v1/ingest/humio-structured', logs)
        .toPromise();
      return response.status === 200;
    } catch {
      return false;
    }
  }
}
