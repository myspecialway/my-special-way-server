import { UsersResolver } from './users.resolver';
import { UsersPersistenceService } from '../../persistence';

describe('user resolver', () => {
    const MOCK_USER = {
        username: 'test_username',
        email: 'email@test.co.il',
        firstname: 'test_firstname',
        lastname: 'test_lastname',
        role: 'PRINCIPLE',
    };
    const MOCK_CONTEXT = {
        user:  MOCK_USER,
    };
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

        const response = await usersResolver.getUsers(null, {}, MOCK_CONTEXT);
        expect(response).toEqual([{ username: 'test' }]);
        expect(userPersistence.getAll).toHaveBeenCalled();
    });

    it('should call getById function and return user on getUserById', async () => {
        (userPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ username: 'test' }));

        const response = await usersResolver.getUserById(null, { id: 'someid' }, MOCK_CONTEXT, null);
        expect(response).toEqual({ username: 'test' });
        expect(userPersistence.getById).toHaveBeenCalledWith('someid');
    });

    it('should call createUser function and return the new user created', async () => {

        (userPersistence.createUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_USER]));

        const response = await usersResolver.createUser(null, {user: MOCK_USER}, MOCK_CONTEXT);
        expect(response).toEqual(MOCK_USER);
        expect(userPersistence.createUser).toHaveBeenCalledWith(MOCK_USER);
    });

    it('should call updateUser function and return the user updated', async () => {

        (userPersistence.updateUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_USER]));

        const response = await usersResolver.updateUser(null, {id: 'someid', user: MOCK_USER}, MOCK_CONTEXT);
        expect(response).toEqual(MOCK_USER);
        expect(userPersistence.updateUser).toHaveBeenCalledWith('someid', MOCK_USER);
    });

    it('should call deleteUser function and return the number of user deleted', async () => {

        (userPersistence.deleteUser as jest.Mock).mockReturnValue(Promise.resolve([null, 1]));

        const response = await usersResolver.deleteUser(null, { id: 'someid' }, MOCK_CONTEXT);
        expect(response).toEqual(1);
        expect(userPersistence.deleteUser).toHaveBeenCalledWith('someid');
    });
});