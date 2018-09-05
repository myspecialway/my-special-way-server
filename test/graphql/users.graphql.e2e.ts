import * as helpers from '../utils/e2e-helper';
import * as request from 'supertest';
import {UserRole} from '../../src/models/user.db.model';

describe('users graphql', () => {
    let token: string;

    beforeEach(async () => {
        await helpers.resetDB();
        await helpers.addUser({
            username: 'test-user',
            password: 'Aa123456',
            role: UserRole.PRINCIPLE,
        });

        token = await helpers.getToken('test-user', 'Aa123456', UserRole.PRINCIPLE);
    });

    it('should create user successfully', () => {
        return request('http://localhost:3000')
            .post('/graphql')
            .send(createUserGraphqlMutation)
            .set('Authorization', `Bearer ${token}`)
            .expect(`{"data":{"createUser":{"username":"mock-username","email":"mock-email","firstname":"israel"}}}`)
            .expect(200);
    });
});

const createUserGraphqlMutation = {
    query: 'mutation($user: InputUser!){\n  createUser(user: $user){\n    username\n    email\n firstname  }\n}',
    variables: {
        user: {
            username: 'mock-username',
            email: 'mock-email',
            firstname: 'israel',
            lastname: 'israeli',
            role: 'TEACHER',
            gender: 'MALE',
        },
    },
};
