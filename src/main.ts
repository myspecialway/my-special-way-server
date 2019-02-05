import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MSWLogger } from './utils/papertrail.logger';
import { getConfig } from './config/config-loader';

const instance = express();
/* Express middleware. */
instance.use(bodyParser.json());
instance.use(bodyParser.urlencoded({ extended: false }));
/* End of express middleware. */

async function bootstrap() {
  const app = await NestFactory.create(AppModule, instance, {
    logger: new MSWLogger(false, getConfig().PAPERTRAIL_HOST_PORT),
  });
  app.setGlobalPrefix('/api');
  app.enableCors();
  app.useStaticAssets(path.join(__dirname, './public'));
  await app.listen(3000);
}
bootstrap().then(() => 'Application is listening on port 3000.');
