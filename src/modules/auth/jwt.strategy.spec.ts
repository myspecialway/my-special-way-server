import * as common from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UsersPersistenceService } from '../persistence/users.persistence.service';

describe('jwt strategy', () => {
    let jwt: JwtStrategy;
    let userPersistenceService: Partial<UsersPersistenceService>;

    beforeAll(() => {
        const errorFunc = common.Logger.error.bind(common.Logger);
        common.Logger.error = (message, trace, context) => {
            errorFunc(message, '', context);
        };
    });
    beforeEach(() => {
        userPersistenceService = {
            getByUsername: jest.fn(),
        };

        jwt = new JwtStrategy(userPersistenceService as UsersPersistenceService);
    });

    it('should return server error if validation fails', async () => {
        expect.hasAssertions();
        const fn = jest.fn();

        (userPersistenceService.getByUsername as jest.Mock).mockReturnValueOnce([new Error('mock error'), null]);
        await jwt.validate({ username: 'not a user' }, fn);

        expect(fn.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    it('should return unauthorized exception if user is not found', async () => {
        // given
        (userPersistenceService.getByUsername as jest.Mock).mockReturnValueOnce([null, null]);
        const fn = jest.fn();

        // when
        await jwt.validate({ username: 'not a user' }, fn);

        // then
        expect(fn.mock.calls[0][0] instanceof Error).toBeTruthy();
    });

    it('should return user if user has been found', async () => {
        // given
        (userPersistenceService.getByUsername as jest.Mock).mockReturnValueOnce([null, {
            username: 'someUser',
        }]);
        const fn = jest.fn();

        // when
        await jwt.validate({ username: 'existingUser' }, fn);

        // then
        expect(fn).toHaveBeenCalledWith(null, { username: 'someUser' });
    });
});
