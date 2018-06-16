import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { initConfig } from './config/config-loader';
import { AppModule } from './app.module';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';

const instance = express();
/* Express middleware. */
instance.use(bodyParser.json());
instance.use(bodyParser.urlencoded({ extended: false }));
/* End of express middleware. */

async function bootstrap() {
  initConfig();
  const app = await NestFactory.create(AppModule, instance);
  app.enableCors();
  app.useStaticAssets(path.join(__dirname, '../public'));
  await app.listen(3000);
}
bootstrap().then(() => 'Application is listening on port 3000.');
