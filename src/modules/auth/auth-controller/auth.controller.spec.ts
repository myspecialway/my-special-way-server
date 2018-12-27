import { AuthController } from './auth.controller';
import { AuthServiceInterface } from '../auth-service/auth.service.interface';
import { AuthService } from '../auth-service/auth.service';

describe('auth controller', () => {
  let authController: AuthController;
  let authServiceMock: AuthServiceInterface;
  let responseMock;
  beforeEach(() => {
    authServiceMock = {
      createTokenFromCridentials: jest.fn(),
      validateUserByCridentials: jest.fn(),
      createTokenFromFirstLoginToken: jest.fn(),
      validateUserNameUnique: jest.fn(),
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
  describe('Fisrt Login', () => {
    it('should return 200 if body with firsLoginToken was passed', async () => {
      const createTokenFn = authServiceMock.createTokenFromFirstLoginToken as jest.Mock<Promise<[Error, string]>>;
      createTokenFn.mockReturnValueOnce([null, 'some-very-secret-token']);

      await authController.firstLogin(responseMock, { firstLoginToken: 'firstToken' });

      expect(responseMock.json).toHaveBeenCalledWith({
        accessToken: 'some-very-secret-token',
      });
    });
    it('should return 400 if body not was passed', async () => {
      const createTokenFn = authServiceMock.createTokenFromFirstLoginToken as jest.Mock<Promise<[Error, string]>>;
      createTokenFn.mockReturnValueOnce([null, 'some-very-secret-token']);

      await authController.firstLogin(responseMock, null);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
    it('should return 500 if error return from service', async () => {
      const createTokenFn = authServiceMock.createTokenFromFirstLoginToken as jest.Mock<Promise<[Error, string]>>;
      createTokenFn.mockReturnValueOnce(['null', null]);

      await authController.firstLogin(responseMock, { firstLoginToken: 'firstToken' });

      expect(responseMock.status).toHaveBeenCalledWith(500);
    });
    it('should return 401 if token not created', async () => {
      const createTokenFn = authServiceMock.createTokenFromFirstLoginToken as jest.Mock<Promise<[Error, string]>>;
      createTokenFn.mockReturnValueOnce([null, null]);

      await authController.firstLogin(responseMock, { firstLoginToken: 'firstToken' });

      expect(responseMock.status).toHaveBeenCalledWith(401);
    });
  });

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
  describe('resetPassword', () => {
    it('should return 400 if no body was passed for resetPassword', async () => {
      // const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<[Error, string]>>;
      // createTokenFn.mockReturnValueOnce([null, 'some-very-secret-token']);

      await authController.resetPassword(responseMock, null);

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });
});
