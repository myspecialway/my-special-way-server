import * as jwt from 'jsonwebtoken';

import { AuthServiceInterface } from './auth.service.interface';
import { AuthService } from './auth.service';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { UserDbModel, UserRole, Gender } from '../../../models/user.db.model';
import { UserLoginRequest } from '../../../models/user-login-request.model';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

describe('auth.service', () => {
  let authService: AuthServiceInterface;
  let userPersistanceServiceMock: Partial<UsersPersistenceService>;

  beforeEach(() => {
    userPersistanceServiceMock = {
      authenticateUser: jest.fn(),
      updateUserPushToken: jest.fn(),
      getByUsername: jest.fn(),
      getUserByFilters: jest.fn(),
      resetPassword: jest.fn(),
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

  it('should create unexpired token if user role is STUDENT', async () => {
    expect.hasAssertions();
    // given
    (userPersistanceServiceMock.authenticateUser as jest.Mock).mockReturnValueOnce([
      null,
      {
        username: 'mock user',
        role: UserRole.STUDENT,
      } as UserDbModel,
    ]);

    // when
    const token = (await authService.createTokenFromCridentials({} as UserLoginRequest))[1];
    const decodedToken: any = jwt.decode(token, { json: true });
    expect(decodedToken.exp).not.toBeDefined();
  });

  describe('test user with no push token', () => {
    for (const emptyPushToken of [null, undefined, , '', '  ', '\n']) {
      const user: UserLoginRequest = {
        username: 'mock-user',
        password: 'mock-pass',
      };
      user.pushToken = emptyPushToken;
      it(`should not try to persist when push token is empty (i.e. '${emptyPushToken}')`, async () => {
        const persisted = await authService.handlePushToken(user);
        expect(persisted).toBeFalsy();
        expect(userPersistanceServiceMock.updateUserPushToken).not.toHaveBeenCalledWith();
      });
    }
  });

  // should call update user when token is provided,
  // make sure that it is being called only with push token
  // parameter
  it('should update push token when a push token is provided', async () => {
    const user: UserLoginRequest = {
      username: 'mock-user',
      password: 'mock-pass',
      pushToken: 'mock-valid-push-token',
    };
    (userPersistanceServiceMock.getByUsername as jest.Mock).mockReturnValueOnce([null, { username: 'any-name' }]);
    const persisted = await authService.handlePushToken(user);
    expect(persisted).toBeTruthy();
    expect(userPersistanceServiceMock.updateUserPushToken).toHaveBeenCalledWith('any-name', user.pushToken);
  });

  it('should NOT update push token when user is not found', async () => {
    const user: UserLoginRequest = {
      username: 'mock-user',
      password: 'mock-pass',
      pushToken: 'mock-valid-push-token',
    };
    (userPersistanceServiceMock.getByUsername as jest.Mock).mockReturnValueOnce([{}, null]);
    const persisted = await authService.handlePushToken(user);
    expect(persisted).toBeFalsy();
    expect(userPersistanceServiceMock.updateUserPushToken).not.toHaveBeenCalled();
  });

  for (const role in UserRole) {
    if (role === UserRole.STUDENT) {
      continue;
    }
    it(`should create expired token if user role is ${role}`, async () => {
      expect.hasAssertions();

      // given
      (userPersistanceServiceMock.authenticateUser as jest.Mock).mockReturnValueOnce([
        null,
        {
          username: 'mock user',
          role,
        } as UserDbModel,
      ]);

      // when
      const token = (await authService.createTokenFromCridentials({} as UserLoginRequest))[1];
      const decodedToken: any = jwt.decode(token, { json: true });
      expect(decodedToken.exp).toBeDefined();
    });
  }
  it('should create valid token if user was found in db', async () => {
    expect.hasAssertions();
    // given
    const mockExp = new Date();
    mockExp.setDate(mockExp.getDate() + 1);
    (userPersistanceServiceMock.getUserByFilters as jest.Mock).mockReturnValueOnce({
      username: 'mock user',
      gender: Gender.MALE,
      firstLoginData: { expiration: mockExp },
    } as Partial<UserDbModel>);

    // when
    const token = await authService.createTokenFromFirstLoginToken('firstLoginToken');
    expect(token[0]).toBeNull();
    expect(token[1]).toBeDefined();
  });
  it('should no create valid token if the expiration is over', async () => {
    expect.hasAssertions();
    // given
    const mockExp = new Date();
    mockExp.setDate(mockExp.getDate() - 1);
    (userPersistanceServiceMock.getUserByFilters as jest.Mock).mockReturnValueOnce({
      username: 'mock user',
      firstLoginData: { expiration: mockExp },
    });

    // when
    const token = await authService.createTokenFromFirstLoginToken('firstLoginToken');
    expect(token[0]).toBeDefined();
    expect(token[1]).toBeNull();
  });
  it('should no create valid token if the user is not found', async () => {
    expect.hasAssertions();
    // given
    const mockExp = new Date();
    mockExp.setDate(mockExp.getDate() - 1);
    (userPersistanceServiceMock.getUserByFilters as jest.Mock).mockReturnValueOnce(null);
    // when
    const token = await authService.createTokenFromFirstLoginToken('firstLoginToken');
    expect(token[0]).toBeDefined();
    expect(token[1]).toBeNull();
  });

  it('should call userPersistanceService.resetPassword when sendResetPasswordEmail is called', async () => {
    (userPersistanceServiceMock.resetPassword as jest.Mock).mockReturnValueOnce([null, true]);
    const persisted = await authService.sendResetPasswordEmail('some-email');
    expect(userPersistanceServiceMock.resetPassword).toHaveBeenCalledWith('some-email');
  });
});
