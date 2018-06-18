jest.mock('mongodb');
import { MongoClient, Db, Collection } from 'mongodb';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UsersPersistenceService } from '../../src/modules/persistence/users.persistence.service';
import { AppModule } from '../../src/app.module';
import { Test } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth-service/auth.service';
import { UserDbModel } from '../../src/models/user.db.model';

describe('users graphql', () => {
    let app: INestApplication;
    let token: string;
    let collection: Partial<Collection>;

    beforeEach(async () => {
        collection = {
            find: jest.fn(),
            findOne: jest.fn(),
            insertOne: jest.fn(),
        };

        MongoClient.connect = () => (Promise.resolve({
            db: () => ({
                collection: () => collection,
            } as Partial<Db>),
        } as MongoClient));

        (collection.findOne as jest.Mock).mockReturnValueOnce({
            username: 'mock-user',
        });
        (collection.findOne as jest.Mock).mockReturnValueOnce({
            username: 'mock-user',
        });

        // create test fixture with app and swap the real users persistance with mocked one
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile();

        // get authService from the fixture and use it to get token for authentication middleware
        const authService = moduleFixture.get<AuthService>(AuthService);
        [, token] = await authService.createTokenFromCridentials({
            username: 'mock-user',
        });

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should create user successfully', () => {
        (collection.insertOne as jest.Mock).mockReturnValueOnce({
            insertedId: 'mock-id',
        });
        (collection.findOne as jest.Mock).mockReturnValueOnce({
            username: 'mock-user',
        });

        return request(app.getHttpServer())
            .post('/graphql')
            .send(createUserGraphqlMutation)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect(`{"data":{"addUser":{"username":"mock-user","email":null}}}`);
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