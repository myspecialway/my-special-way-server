import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { UsersPersistenceService } from '../../src/modules/persistence/users.persistence.service';
import { AuthService } from '../../src/modules/auth/auth-service/auth.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let usersPersistenceServiceMock: Partial<UsersPersistenceService>;

  beforeEach(async () => {
    // initialize users persistance mock to act as fake DB
    usersPersistenceServiceMock = {
      getAll: jest.fn(),
      authenticateUser: jest.fn(),
      getByUsername: async () => [null, { username: 'mock-user' }],
    } as Partial<UsersPersistenceService>;

    // create test fixture with app and swap the real users persistance with mocked one
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersPersistenceService)
      .useValue(usersPersistenceServiceMock)
      .compile();

    // get authService from the fixture and use it to get token for authentication middleware
    const authService = moduleFixture.get<AuthService>(AuthService);
    (usersPersistenceServiceMock.authenticateUser as jest.Mock).mockReturnValueOnce(Promise.resolve([null, { username: 'mock-user' }]));
    [, token] = await authService.createTokenFromCridentials({
      username: 'test-user',
      password: 'password',
    });

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should get 401 error on unauthenticated graphql query', () => {
    (usersPersistenceServiceMock.authenticateUser as jest.Mock).mockReturnValueOnce(Promise.resolve([null, { username: 'mock-user' }]));

    return request(app.getHttpServer())
      .post('/graphql?query=%7B%0A%20%20message%0A%7D')
      .expect(401);
  });

  it('should return query response when authenticated', () => {
    (usersPersistenceServiceMock.getAll as jest.Mock).mockReturnValueOnce([{ username: 'mock-user' }]);

    return request(app.getHttpServer())
      .get('/graphql?query=%7Busers%20%7Busername%7D%7D')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(`{"data":{"users":[{"username":"mock-user"}]}}`);
  });
});
