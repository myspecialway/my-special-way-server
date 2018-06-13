import { UsersPersistenceService } from './users.persistence.service';
import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';

describe('users persistence', () => {
    let usersPersistanceService: UsersPersistenceService;
    let dbServiceMock: Partial<DbService>;
    beforeEach(() => {
        dbServiceMock = {
            getConnection: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    find: jest.fn(),
                    findOne: jest.fn(),
                } as Partial<Collection>),
            } as Partial<Db>),
        };

        usersPersistanceService = new UsersPersistenceService(dbServiceMock as DbService);
    });

    it('should get all users successfuly on getAll', async () => {
        (dbServiceMock.getConnection().collection('users').find as jest.Mock).mockReturnValueOnce({
            toArray: jest.fn().mockReturnValueOnce([{ username: 'user1' }, { username: 'user2' }]),
        });

        const users = await usersPersistanceService.getAll();
        expect(users).toEqual([{ username: 'user1' }, { username: 'user2' }]);
    });
    it('should throw an error on error through getAll function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection('users').find as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await usersPersistanceService.getAll().catch((error) => expect(error).not.toBeUndefined());
    });

    it('should get user sucessfully on getById', async () => {
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'user1',
        });

        const users = await usersPersistanceService.getById('507f1f77bcf86cd799439011');
        expect(users).toEqual({ username: 'user1' });
    });

    it('should throw an error on error through getById function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await usersPersistanceService.getById('507f1f77bcf86cd799439011')
            .catch((error) => expect(error).not.toBeUndefined());
    });

    it('should call db.getConnection only once', async () => {
        expect.assertions(1);

        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'user1',
        });

        await usersPersistanceService.getById('507f1f77bcf86cd799439011');
        await usersPersistanceService.getById('507f1f77bcf86cd799439011');
        await usersPersistanceService.getById('507f1f77bcf86cd799439011');
        await usersPersistanceService.getById('507f1f77bcf86cd799439011');

        // this function gets called 2 times because first time it's been called via the test itself
        // this needs to be refactored

        expect(dbServiceMock.getConnection).toHaveBeenCalledTimes(2);
    });

    it('should return user from getByUsername on sucess', async () => {
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'user1',
        });

        const [error, user] = await usersPersistanceService.getByUsername('someUsername');

        expect(error).toBeNull();
        expect(user).toEqual({ username: 'user1' });
    });

    it('should return an error on persistance error', async () => {
        expect.hasAssertions();

        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        const [error, user] = await usersPersistanceService.getByUsername('someUsername');

        expect(error).toBeDefined();
    });

    it(`should return user and error nulls if user hasn't been found`, async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce(null);

        const [error, user] = await usersPersistanceService.getByUsername('someUsername');

        expect(error).toBeNull();
        expect(user).toBeNull();
    });

    it('should return user from authenticateUser on sucess', async () => {
        expect.hasAssertions();

        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'user1',
        });

        const [error, user] = await usersPersistanceService.authenticateUser('someUsername');

        expect(error).toBeNull();
        expect(user).toEqual({ username: 'user1' });
    });

    it('should return an error on authenticateUser error', async () => {
        expect.hasAssertions();

        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        const [error, user] = await usersPersistanceService.authenticateUser('someUsername');

        expect(error).toBeDefined();
        expect(user).toBeNull();
    });
});