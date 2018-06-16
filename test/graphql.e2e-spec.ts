import * as request from 'supertest';
import * as mongoMock from './mongo-mock';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication, RequestTimeoutException } from '@nestjs/common';
import { Cursor } from 'mongodb';
import { AuthService } from '../src/modules/auth/auth-service/auth.service';
import { UsersPersistenceService } from '../src/modules/persistence/users.persistence.service';
import { DbService } from '../src/modules/persistence/db.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    mongoMock.setupMongoMock();
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    mongoMock.setupMongoMock();
    const dbService = new DbService();
    dbService.initConnection('', '');

    const authService = new AuthService(new UsersPersistenceService(dbService));
    const [error, token] = await authService.createTokenFromCridentials('msw-teacher');

    // console.log(error);
  });

  it('should get 401 error on unauthenticated graphql query', () => {
    return request(app.getHttpServer())
      .post('/graphql?query=%7B%0A%20%20message%0A%7D')
      .expect(401);
  });

  // Must mock the db
  xit('should return query response when authenticated', () => {
    // mongoMock.setFindREturnValue({
    //   toArray: jest.fn(),
    // } as Partial<Cursor>);

    return request(app.getHttpServer())
      .get('/graphql?query=%7Busers%20%7Busername%7D%7D')
      // tslint:disable-next-line:max-line-length
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1zdyIsInBhc3N3b3JkIjoiQWExMjM0NTYiLCJpYXQiOjE1Mjc2ODI5NTJ9.DKk93uF464t-c7WQVtxIvEE77PsUVwdX9vL_y8Is8_4')
      .expect(200)
      .expect(`{"data":{"users":null}}`);
  });
});
