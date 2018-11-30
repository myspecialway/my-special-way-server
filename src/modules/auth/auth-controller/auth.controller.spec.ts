import { AuthController } from './auth.controller';
import { AuthServiceInterface } from '../auth-service/auth.service.interface';
import { AuthService } from '../auth-service/auth.service';
import { UserLoginRequest } from '../../../models/user-login-request.model';

describe('auth controller', () => {
  let authController: AuthController;
  let authServiceMock: AuthServiceInterface;
  let responseMock;
  beforeEach(() => {
    authServiceMock = {
      createTokenFromCridentials: jest.fn(),
      validateUserByCridentials: jest.fn(),
      validateUserNameUnique: jest.fn(),
      handlePushToken: jest.fn(),
    };

    responseMock = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    authController = new AuthController(authServiceMock as AuthService);
  });

  it('should return 400 if no body was passed', async () => {
    const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<[Error, string]>>;
    createTokenFn.mockReturnValueOnce([null, 'some-very-secret-token']);

    await authController.login(responseMock, null);

    expect(responseMock.status).toHaveBeenCalledWith(400);
  });

  it('should return 500 server error if error happened', async () => {
    const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<[Error, string]>>;
    createTokenFn.mockReturnValueOnce([new Error('mock error'), null]);

    await authController.login(responseMock, { username: 'mock-user', password: 'mock-password' });

    expect(responseMock.status).toHaveBeenCalledWith(500);
    expect(responseMock.json).toHaveBeenCalledWith({
      error: 'server error',
      message: 'unknown server error',
    });
  });

  it('should return 401 if user token returned null', async () => {
    expect.hasAssertions();

    const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<[Error, string]>>;
    createTokenFn.mockReturnValueOnce([null, null]);

    await authController.login(responseMock, { username: 'mock-user', password: 'mock-password' });

    expect(responseMock.status).toHaveBeenCalledWith(401);
    expect(responseMock.json).toHaveBeenCalledWith({
      error: 'unauthenticated',
      message: 'username of password are incorrect',
    });
  });

  it('should return response with token if user has been found and password match', async () => {
    expect.hasAssertions();

    const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<[Error, string]>>;
    createTokenFn.mockReturnValueOnce([null, 'some-very-secret-token']);

    await authController.login(responseMock, { username: 'mock-user', password: 'mock-password' });

    expect(responseMock.json).toHaveBeenCalledWith({
      accessToken: 'some-very-secret-token',
    });
  });
  /**************************8 */
  it('should call store firebase token if user provides firebase token', async () => {
    // create user object with push token.
    const anyUserWithToken: UserLoginRequest = {
      username: 'mock-use',
      password: 'mock-password',
      pushToken: 'pushToken',
    };
    // do success login
    const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<[Error, string]>>;
    createTokenFn.mockReturnValueOnce([null, 'any-token']);
    await authController.login(responseMock, anyUserWithToken);
    // make sure store token is called
    expect(authServiceMock.handlePushToken).toHaveBeenCalled();
  });

  it('should not try to store push token if user login fails', async () => {
    // create user object with push token.
    const anyUserWithToken: UserLoginRequest = {
      username: 'mock-use',
      password: 'mock-password',
      pushToken: 'pushToken',
    };
    // do success login
    const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<[Error, string]>>;
    createTokenFn.mockReturnValueOnce([new Error(), null]);
    await authController.login(responseMock, anyUserWithToken);
    // make sure store token is called
    expect(authServiceMock.handlePushToken).not.toHaveBeenCalled();
  });

  /***************************** */
  describe('validateUserNameUnique', () => {
    it('should return 400 if no body was passed', async () => {
      const validateUserNameUniqueFn = authServiceMock.validateUserNameUnique as jest.Mock<Promise<[Error, string]>>;
      validateUserNameUniqueFn.mockReturnValueOnce([null, true]);

      await authController.validateUserNameUnique(responseMock, null);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });

    it('should return 500 server error if error happened', async () => {
      const validateUserNameUniqueFn = authServiceMock.validateUserNameUnique as jest.Mock<Promise<[Error, string]>>;
      validateUserNameUniqueFn.mockReturnValueOnce([new Error('mock error'), null]);

      await authController.validateUserNameUnique(responseMock, { username: 'mock-user', id: 'mock-id' });

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(responseMock.json).toHaveBeenCalledWith({
        error: 'server error',
        message: 'unknown server error',
      });
    });

    it('should return 200 ok with response true if username is unique', async () => {
      const validateUserNameUniqueFn = authServiceMock.validateUserNameUnique as jest.Mock<Promise<[Error, string]>>;
      validateUserNameUniqueFn.mockReturnValueOnce([null, true]);

      await authController.validateUserNameUnique(responseMock, { username: 'mock-user', id: 'mock-id' });

      expect(responseMock.status).not.toHaveBeenCalled();
      expect(responseMock.json).toHaveBeenCalledWith({ isUnique: true });
    });

    it('should return 200 ok with response false if username is taken', async () => {
      const validateUserNameUniqueFn = authServiceMock.validateUserNameUnique as jest.Mock<Promise<[Error, string]>>;
      validateUserNameUniqueFn.mockReturnValueOnce([null, false]);

      await authController.validateUserNameUnique(responseMock, { username: 'mock-user', id: 'mock-id' });

      expect(responseMock.status).not.toHaveBeenCalled();
      expect(responseMock.json).toHaveBeenCalledWith({ isUnique: false });
    });
  });
});
