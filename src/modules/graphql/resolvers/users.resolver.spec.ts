import { UsersResolver } from './users.resolver';
import { UsersPersistanceService } from '../../persistance/users.persistance';

describe('user resolver', () => {
    let usersResolver: UsersResolver;
    let userPersistance: Partial<UsersPersistanceService>;
    beforeEach(() => {
        userPersistance = {
            getAll: jest.fn(),
            getById: jest.fn(),
        };

        usersResolver = new UsersResolver(userPersistance as UsersPersistanceService);
    });

    it('should call getAll function and resutn users for on getUsers', async () => {
        (userPersistance.getAll as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test' }]));

        const response = await usersResolver.getUsers(null, null, null, null);
        expect(response).toEqual([{ username: 'test' }]);
        expect(userPersistance.getAll).toHaveBeenCalled();
    });

    it('should call getById function and return user on getUserById', async () => {
        (userPersistance.getById as jest.Mock).mockReturnValue(Promise.resolve({ username: 'test' }));

        const response = await usersResolver.getUserById(null, { id: 'someid' }, null, null);
        expect(response).toEqual({ username: 'test' });
        expect(userPersistance.getById).toHaveBeenCalledWith('someid');
    });
});