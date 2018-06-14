import { UsersResolver } from './users.resolver';
import { UsersPersistenceService } from '../../persistence/';

describe('user resolver', () => {
    let usersResolver: UsersResolver;
    let userPersistence: Partial<UsersPersistenceService>;
    beforeEach(() => {
        userPersistence = {
            getAll: jest.fn(),
            getById: jest.fn(),
        };

        usersResolver = new UsersResolver(userPersistence as UsersPersistenceService);
    });

    it('should call getAll function and resutn users for on getUsers', async () => {
        (userPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test' }]));

        const response = await usersResolver.getUsers(null, null, null, null);
        expect(response).toEqual([{ username: 'test' }]);
        expect(userPersistence.getAll).toHaveBeenCalled();
    });

    it('should call getById function and return user on getUserById', async () => {
        (userPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ username: 'test' }));

        const response = await usersResolver.getUserById(null, { id: 'someid' }, null, null);
        expect(response).toEqual({ username: 'test' });
        expect(userPersistence.getById).toHaveBeenCalledWith('someid');
    });
});