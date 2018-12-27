import * as request from 'supertest';
import * as helpers from '../utils/e2e-helper';

import { ClassDbModel } from '../../src/models/class.db.model';
import { UserRole } from '../../src/models/user.db.model';

describe('classes graphql', () => {
  let token: string;

  beforeEach(async () => {
    await helpers.resetDB();
    await helpers.addUser({
      username: 'test-user',
      password: 'Aa123456',
      role: 'PRINCIPLE',
    });

    token = await helpers.getToken('test-user', 'Aa123456', UserRole.PRINCIPLE);
  });

  // it('should fetch classes successfully by query', async () => {
  it('should get error', async () => {
    await helpers.addClass({
      name: 'test-class',
    });

    return (
      request('http://localhost:3000')
        .post('/graphql')
        .send(CLASSES_GET_QUERY)
        .set('Authorization', `Bearer1 ${token}`)
        // .expect(`{"data":{"classes":[]}}`)
        // .expect(200);
        .expect(401)
    );
  });
});

const CLASSES_GET_QUERY = { variables: {}, query: '{\n  classes {\n    name\n  }\n}\n' };
