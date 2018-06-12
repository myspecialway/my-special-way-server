import { JwtStrategy } from './jwt.strategy';
import { AuthServiceInterface } from './auth-service/auth.service.interface';
import { UserDbModel } from '../../models/user.db.model';
import { UsersPersistenceService } from '../persistence/users.persistence.service';

describe('jwt strategy', () => {
    let jwt: JwtStrategy;
    let userPersistenceService: Partial<UsersPersistenceService>;
    beforeEach(() => {
        userPersistenceService = {
            getByUsername: jest.fn(),
        };

        jwt = new JwtStrategy(userPersistenceService as UsersPersistenceService);
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