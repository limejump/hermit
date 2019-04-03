import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { authenticate } from './../src/middleware/authentication.middleware';
import { UnstructuredLogService } from '../src/services/unstructured-log.service';
import { StructuredLogService } from '../src/services/structured-log.service';
import { NestApplication } from '@nestjs/core';
import * as mockedEnv from 'mocked-env';

describe('AppController (e2e)', () => {
  let app: NestApplication;
  // To avoid testing our services - just ensure they're called
  const serviceMock = {
    // tslint:disable-next-line
    sendLogs: () => {},
  };

  beforeEach(async () => {
    // Set up a fake authorization key
    mockedEnv({
      AUTHORIZATION_KEY: 'goodsecret',
    });

    // Mock the services
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UnstructuredLogService)
      .useValue(serviceMock)
      .overrideProvider(StructuredLogService)
      .useValue(serviceMock)
      .compile();
    serviceMock.sendLogs = jest.fn();

    app = moduleFixture.createNestApplication();
    app.use(authenticate);
    await app.init();
  });

  it('/v1/ready (GET)', async () => {
    await request(app.getHttpServer())
      .get('/v1/ready')
      .expect(200);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(0);
  });

  it('/v1/unstructured (POST) fails without authorization', async () => {
    await request(app.getHttpServer())
      .post('/v1/unstructured')
      .expect(403);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(0);
  });

  it('/v1/structured (POST) fails without authorization', async () => {
    await request(app.getHttpServer())
      .post('/v1/structured')
      .expect(403);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(0);
  });

  it('/v1/unstructured (POST) fails with bad authorization', async () => {
    await request(app.getHttpServer())
      .post('/v1/unstructured')
      .set('Authorization', 'Bearer badsecret')
      .expect(403);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(0);
  });

  it('/v1/unstructured (POST) succeeds with good authorization', async () => {
    await request(app.getHttpServer())
      .post('/v1/unstructured')
      .set('Authorization', 'Bearer goodsecret')
      .expect(201);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(1);
  });

  it('/v1/structured (POST) succeeds with good authorization', async () => {
    await request(app.getHttpServer())
      .post('/v1/structured')
      .set('Authorization', 'Bearer goodsecret')
      .expect(201);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(1);
  });
});
