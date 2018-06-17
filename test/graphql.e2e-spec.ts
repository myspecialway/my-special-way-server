import * as request from 'supertest';
import * as testHelpers from './utils/tests-helper';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    token = await testHelpers.generateToken();

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
  });

  it('should get 401 error on unauthenticated graphql query', () => {
    return request(app.getHttpServer())
      .post('/graphql?query=%7B%0A%20%20message%0A%7D')
      .expect(401);
  });

  it('should return query response when authenticated', () => {

    return request(app.getHttpServer())
      .get('/graphql?query=%7Busers%20%7Busername%7D%7D')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(`{"data":{"users":[{"username":"token-user"}]}}`);
  });
});
