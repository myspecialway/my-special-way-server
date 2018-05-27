import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /graphql?query={ message }', () => {
    return request(app.getHttpServer())
      .get('/graphql?query=%7B%0A%20%20message%0A%7D')
      .expect(200)
      .expect('{"data":{"message":"Welcome to My-Special-W@@y!"}}');
  });
  it('/POST /', () => {
    return request(app.getHttpServer())
      .post('/')
      .expect(404);
  });
  it('/GET /123', () => {
    return request(app.getHttpServer())
      .get('/123')
      .expect(404);
  });
});
