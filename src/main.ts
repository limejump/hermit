import { NestFactory } from '@nestjs/core';
import './utils/env';

import * as Sentry from '@sentry/node';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { authenticate } from './middleware/authentication.middleware';
import { HttpExceptionFilter } from './errors/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(authenticate);
  app.use(helmet());
  app.use(compression());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors(createCorsOptions());

  await app.listen(3000);
}

if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'development') {
  throw { error: 'No JWT secret nd running in production' };
}

if (
  !process.env.DEFAULT_INGEST_TOKEN &&
  process.env.NODE_ENV !== 'development'
) {
  throw { error: 'No ingest token set up and running in production' };
}

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://c2407fb242fb4d1c8f79aad025155272@sentry.io/1518356',
  });
}

bootstrap();

/// Creates the CORs Options Object
/// https://expressjs.com/en/resources/middleware/cors.html
function createCorsOptions() {
  const defaultOriginsAllowed =
    process.env.NODE_ENV !== 'production' ? [/localhost/, /127.0.0.1$/] : [];
  let whitelistedOrigins = [];

  if (process.env.WHITELIST_CORS) {
    whitelistedOrigins = process.env.WHITELIST_CORS.split(',').map(r => {
      // Ensure the CORs regex strings are converted to regex
      if (r.startsWith('/') && r.endsWith('/')) {
        return new RegExp(r.substr(1, r.length - 2));
      }
      return r;
    });
  }

  const origin = [...whitelistedOrigins, ...defaultOriginsAllowed];

  return {
    origin,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  };
}
