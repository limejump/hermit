import { Injectable, HttpService } from '@nestjs/common';
import { UnstructuredLogDto } from '../dtos/unstructured-log';

@Injectable()
export class UnstructuredLogService {
  constructor(private readonly httpService: HttpService) {}

  async sendLogs(logs: UnstructuredLogDto): Promise<boolean> {
    try {
      const response = await this.httpService
        .post('/api/v1/ingest/humio-unstructured', logs)
        .toPromise();
      return response.status === 200;
    } catch {
      return false;
    }
  }
}
