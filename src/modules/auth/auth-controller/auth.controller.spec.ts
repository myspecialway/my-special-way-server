import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthServiceInterface } from '../auth-service/auth.service.interface';

describe('auth controller', () => {
    let authController: AuthController;
    let authServiceMock: AuthServiceInterface;
    let responseMock;
    beforeEach(() => {
        authServiceMock = {
            createTokenFromCridentials: jest.fn(),
            validateUserByCridentials: jest.fn(),
        };

        responseMock = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        authController = new AuthController(authServiceMock);
    });

    it('should return with 401 if user is not found', async () => {
        const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<string>>;
        createTokenFn.mockReturnValue(null);

        await authController.login(responseMock, null);

        expect(responseMock.status.mock.calls[0][0]).toBe(401);
        expect(responseMock.json.mock.calls[0][0]).toEqual({
            error: 'unauthenticated',
            message: 'username of password are incorrect',
        });
    });

    it('should return token if user has been found', async () => {
        const createTokenFn = authServiceMock.createTokenFromCridentials as jest.Mock<Promise<string>>;
        createTokenFn.mockReturnValue('some-token');

        await authController.login(responseMock, null);

        expect(responseMock.json.mock.calls[0][0]).toEqual({ accessToken: 'some-token' });
    });
});