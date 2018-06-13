import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as bodyParser from 'body-parser';

const instance = express();
/* Express middleware. */
instance.use(bodyParser.json());
instance.use(bodyParser.urlencoded({ extended: false }));
/* End of express middleware. */

async function bootstrap() {
  const app = await NestFactory.create(AppModule, instance);
  app.enableCors();
  await app.listen(3000);
}
bootstrap().then(() => 'Application is listening on port 3000.');
