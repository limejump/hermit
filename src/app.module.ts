import { Module, HttpModule } from '@nestjs/common';
import { StructuredLogController as StructuredLogController } from './controllers/structured-log.controller';
import { StructuredLogService } from './services/structured-log.service';
import { UnstructuredLogController } from './controllers/unstructured-log.controller';
import { UnstructuredLogService } from './services/unstructured-log.service';
import { ReadyController } from './controllers/ready.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 3000,
      baseURL: 'https://cloud.humio.com/',
      headers: {Authorization: `Bearer ${process.env.DEFAULT_INGEST_TOKEN}`},
    }),
  ],
  controllers: [StructuredLogController, UnstructuredLogController, ReadyController],
  providers: [StructuredLogService, UnstructuredLogService],
})
export class AppModule {}
