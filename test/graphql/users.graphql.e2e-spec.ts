import * as mongodbHelpers from '../utils/mongo-db-helpers';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Test } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth-service/auth.service';
import { UserDbModel } from '../../src/models/user.db.model';

describe('users graphql', () => {
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

    it('should create user successfully', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(createUserGraphqlMutation)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect(`{"data":{"addUser":{"username":"mock-username","email":"mock-email"}}}`);
    });
});

const createUserGraphqlMutation = {
    query: 'mutation($user: InputUser!){\n  addUser(user: $user){\n    username\n    email\n  }\n}',
    variables: {
        user: {
            username: 'mock-username',
            email: 'mock-email',
        },
    },
};