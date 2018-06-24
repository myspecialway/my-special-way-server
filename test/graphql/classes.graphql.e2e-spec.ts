import * as mongodbHelpers from '../utils/mongo-db-helpers';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserDbModel } from '../../src/models/user.db.model';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/modules/auth/auth-service/auth.service';
import { ClassDbModel } from '../../src/models/class.db.model';

describe('classes graphql', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    await mongodbHelpers.startMockMongodb();
    await mongodbHelpers.addMockUser({
      username: 'test-user',
      password: 'password',
    } as UserDbModel);

    // create test fixture with app and swap the real users persistance with mocked one
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // get authService from the fixture and use it to get token for authentication middleware
    const authService = moduleFixture.get<AuthService>(AuthService);
    [, token] = await authService.createTokenFromCridentials({
      username: 'test-user',
      password: 'password',
    });
  });

  afterEach(() => {
    mongodbHelpers.stopMockMongodb();
  });

  it('should fetch classes successfully by query', async () => {
    await mongodbHelpers.addMockClass({
      name: 'test-class',
    } as ClassDbModel);

    return request(app.getHttpServer())
      .post('/graphql')
      .send(CLASSES_GET_QUERY)
      .set('Authorization', `Bearer ${token}`)
      .expect(`{"data":{"classes":[{"name":"test-class"}]}}`)
      .expect(200);
  });
});

const CLASSES_GET_QUERY = { variables: {}, query: '{\n  classes {\n    name\n  }\n}\n' };