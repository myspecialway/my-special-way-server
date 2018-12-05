import { AuthController } from './auth.controller';
import { AuthServiceInterface } from '../auth-service/auth.service.interface';
import { AuthService } from '../auth-service/auth.service';
import { SendEmail } from '../../../utils/nodeMailer/email.client';

describe('auth controller', () => {
  let authController: AuthController;
  let authServiceMock: AuthServiceInterface;
  const sendEmail: SendEmail = new SendEmail();
  let responseMock;
  beforeEach(() => {
    authServiceMock = {
      createTokenFromCridentials: jest.fn(),
      validateUserByCridentials: jest.fn(),
      validateUserNameUnique: jest.fn(),
    };

    responseMock = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    authController = new AuthController(authServiceMock as AuthService, sendEmail);
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
  it('should failed to return response with status ok if mail as been sent', async () => {
    expect.hasAssertions();

    const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<[Error, string]>>;
    createTokenFn.mockReturnValueOnce([null, 'some-very-secret-token']);

    await authController.restorePassword(responseMock, {
      email: 'user@gmail.com',
      username: 'mock-user',
      password: 'mock-password',
    });

    expect(responseMock.json).toHaveBeenCalledWith({
      status: 'ok',
    });
    // expect(responseMock.json).toHaveBeenCalledWith({
    //   error: 'server error',
    //   message: 'unknown server error',
    // });
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
});
