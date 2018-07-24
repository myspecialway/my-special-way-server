import * as request from 'supertest';
import * as helpers from '../utils/e2e-helper';

import { ClassDbModel } from '../../src/models/class.db.model';

describe('classes graphql', () => {
  let token: string;

  beforeEach(async () => {
    await helpers.resetDB();
    await helpers.addUser({
        username: 'test-user',
        password: 'Aa123456',
    });

    token = await helpers.getToken('test-user', 'Aa123456');
  });

  it('should fetch classes successfully by query', async () => {
    await helpers.addClass({
      name: 'test-class',
    });

    return request('http://localhost:3000')
      .post('/graphql')
      .send(CLASSES_GET_QUERY)
      .set('Authorization', `Bearer ${token}`)
      .expect(`{"data":{"classes":[{"name":"test-class"}]}}`)
      .expect(200);
  });
});

const CLASSES_GET_QUERY = { variables: {}, query: '{\n  classes {\n    name\n  }\n}\n' };
