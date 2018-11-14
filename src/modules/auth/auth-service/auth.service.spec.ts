import { AuthServiceInterface } from './auth.service.interface';
import { AuthService } from './auth.service';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { UserDbModel } from '../../../models/user.db.model';
import { UserLoginRequest } from '../../../models/user-login-request.model';

describe('auth.service', () => {
  let authService: AuthServiceInterface;
  let userPersistanceServiceMock: Partial<UsersPersistenceService>;

  beforeEach(() => {
    userPersistanceServiceMock = {
      authenticateUser: jest.fn(),
      getUserByFilters: jest.fn(),
    };

    authService = new AuthService(userPersistanceServiceMock as UsersPersistenceService);
  });

  it('should create valid token if user was found in db', async () => {
    expect.hasAssertions();
    // given
    (userPersistanceServiceMock.authenticateUser as jest.Mock).mockReturnValueOnce([
      null,
      {
        username: 'mock user',
      } as UserDbModel,
    ]);

    // when
    const token = await authService.createTokenFromCridentials({} as UserLoginRequest);
    expect(token).toBeDefined();
  });
  it.only('should create valid token if user was found in db', async () => {
    expect.hasAssertions();
    // given
    (userPersistanceServiceMock.getUserByFilters as jest.Mock).mockReturnValueOnce({
      username: 'mock user',
    });

    // when
    const token = await authService.createTokenFromFirstLoginToken('firstLoginToken');
    expect(token).toBeDefined();
  });
});
