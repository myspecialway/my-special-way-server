import * as request from 'supertest';
import * as mongodbHelpers from '../utils/mongo-db-helpers';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../src/modules/auth/auth-service/auth.service';
import { UserDbModel } from '../../src/models/user.db.model';

describe('AppController (e2e)', async () => {
  let app: INestApplication;
  let token: string;
  let mongod;
  beforeEach(async () => {
    mongod = mongodbHelpers.startMockMongodb();

    await mongodbHelpers.addMockUser({
      username: 'test-user',
      password: 'password',
    } as UserDbModel);

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const authService = moduleFixture.get<AuthService>(AuthService);
    [, token] = await authService.createTokenFromCridentials({
      username: 'test-user',
      password: 'password',
    });
  });

  afterEach(() => {
    mongodbHelpers.stopMockMongodb();
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
      .expect(`{"data":{"users":[{"username":"test-user"}]}}`);
  });
});
