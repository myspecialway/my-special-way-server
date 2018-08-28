import * as request from 'supertest';
import * as helpers from '../utils/e2e-helper';

describe('AppController (e2e)', async () => {
    let token: string;
    beforeEach(async () => {
        await helpers.resetDB();
        await helpers.addUser({
            username: 'test-user',
            password: 'Aa123456',
            role: 'PRINCIPLE',
        });

        token = await helpers.getToken('test-user', 'Aa123456');
    });

    it('should get 401 error on unauthenticated graphql query', () => {

        return request('http://localhost:3000')
            .post('/graphql?query=%7B%0A%20%20message%0A%7D')
            .expect(401);
    });

    it('should return query response when authenticated', () => {
        return request('http://localhost:3000')
            .get('/graphql?query=%7Busers%20%7Busername%7D%7D')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect(`{"data":{"users":[{"username":"test-user"}]}}`);
    });
});
