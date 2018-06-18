import { UsersResolver } from './users.resolver';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';

describe('user resolver', () => {
    let usersResolver: UsersResolver;
    let userPersistence: Partial<UsersPersistenceService>;
    beforeEach(() => {
        userPersistence = {
            getAll: jest.fn(),
            getById: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
        };

        usersResolver = new UsersResolver(userPersistence as UsersPersistenceService);
    });

    it('should call getAll function and resutn users for on getUsers', async () => {
        (userPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test' }]));

        const response = await usersResolver.getUsers();
        expect(response).toEqual([{ username: 'test' }]);
        expect(userPersistence.getAll).toHaveBeenCalled();
    });

    it('should call getById function and return user on getUserById', async () => {
        (userPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ username: 'test' }));

        const response = await usersResolver.getUserById({ id: 'someid' });
        expect(response).toEqual({ username: 'test' });
        expect(userPersistence.getById).toHaveBeenCalledWith('someid');
    });

    it('should call createUser function and return the new user created', async () => {
        const MOCK_USER = {
                            username: 'ah584d',
                            email: 'email@test.co.il',
                            firstname: 'avraham',
                            lastname: 'hamu',
                            role: 'PRINCIPLE',
                        };

        (userPersistence.createUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_USER]));

        const response = await usersResolver.createUser(null, {user: MOCK_USER});
        expect(response).toEqual(MOCK_USER);
        expect(userPersistence.createUser).toHaveBeenCalledWith(MOCK_USER);
    });

    it('should call updateUser function and return the user updated', async () => {
        const MOCK_USER = {
                            username: 'ah584d',
                            email: 'email@test.co.il',
                            firstname: 'avraham',
                            lastname: 'hamu',
                            role: 'PRINCIPLE',
                        };

        (userPersistence.updateUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_USER]));

        const response = await usersResolver.updateUser(null, {id: 'someid', user: MOCK_USER});
        expect(response).toEqual(MOCK_USER);
        expect(userPersistence.updateUser).toHaveBeenCalledWith('someid', MOCK_USER);
    });

    it('should call deleteUser function and return the number of user deleted', async () => {

        (userPersistence.deleteUser as jest.Mock).mockReturnValue(Promise.resolve([null, 1]));

        const response = await usersResolver.deleteUser(null, { id: 'someid' });
        expect(response).toEqual(1);
        expect(userPersistence.deleteUser).toHaveBeenCalledWith('someid');
    });
});