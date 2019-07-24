import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { authenticate } from './../src/middleware/authentication.middleware';
import { UnstructuredLogService } from '../src/services/unstructured-log.service';
import { StructuredLogService } from '../src/services/structured-log.service';
import { NestApplication } from '@nestjs/core';
import * as mockedEnv from 'mocked-env';

import { sign } from 'jsonwebtoken';

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
      JWT_SECRET: 'goodsecret',
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
      .expect(401);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(0);
  });

  it('/v1/structured (POST) fails without authorization', async () => {
    await request(app.getHttpServer())
      .post('/v1/structured')
      .expect(401);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(0);
  });

  it('/v1/unstructured (POST) fails with bad authorization', async () => {
    await request(app.getHttpServer())
      .post('/v1/unstructured')
      .set('Authorization', 'Bearer notasignedtoken')
      .expect(401);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(0);
  });

  it('/v1/unstructured (POST) succeeds with good authorization', async () => {
    const goodToken = sign({}, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: 300,
    });
    await request(app.getHttpServer())
      .post('/v1/unstructured')
      .set('Authorization', `Bearer ${goodToken}`)
      .expect(201);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(1);
  });

  it('/v1/structured (POST) succeeds with good authorization', async () => {
    const goodToken = sign({}, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: 300,
    });
    await request(app.getHttpServer())
      .post('/v1/structured')
      .set('Authorization', `Bearer ${goodToken}`)
      .expect(201);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(1);
  });

  it('/v1/structured (POST) succeeds with good authorization without bearer', async () => {
    const goodToken = sign({}, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: 300,
    });
    await request(app.getHttpServer())
      .post('/v1/structured')
      .set('Authorization', `Bearer ${goodToken}`)
      .expect(201);
    expect(serviceMock.sendLogs).toHaveBeenCalledTimes(1);
  });
});
