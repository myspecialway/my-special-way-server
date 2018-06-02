import { JwtStrategy } from './jwt.strategy';
import { AuthServiceInterface } from './auth-service/auth.service.interface';
import { UserCridentials } from '../../models/user-credentials.model';

describe('jwt strategy', () => {
    let jwt: JwtStrategy;
    let authServiceMock: AuthServiceInterface;
    beforeEach(() => {
        authServiceMock = {
            createTokenFromCridentials: jest.fn(),
            validateUserByCridentials: jest.fn(),
        };

        jwt = new JwtStrategy(authServiceMock);
    });

    it('should return unauthorized exception if user validation failed', async () => {
        // given
        const validateFn = authServiceMock.validateUserByCridentials as jest.Mock<Promise<UserCridentials>>;
        validateFn.mockReturnValue(Promise.resolve(null));
        const fn = jest.fn();

        // when
        await jwt.validate({ username: 'not a user', password: 'not a password' }, fn);

        // then
        expect(fn.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    it('should return user if user has been found', async () => {
        // given
        const validateFn = authServiceMock.validateUserByCridentials as jest.Mock<Promise<UserCridentials>>;
        validateFn.mockReturnValue(Promise.resolve<UserCridentials>({
            username: 'existingUser',
            password: 'existingPassword',
        }));
        const fn = jest.fn();

        // when
        await jwt.validate({ username: 'existingUser', password: 'existingPassword' }, fn);

        // then
        expect(fn.mock.calls[0][1]).toEqual({ username: 'existingUser', password: 'existingPassword' });
    });
});