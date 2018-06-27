import * as common from '@nestjs/common';
import { UsersPersistenceService } from './users.persistence.service';
import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';
import { UserRole } from '../../models/user.db.model';

describe('users persistence', () => {
    let usersPersistanceService: UsersPersistenceService;
    let dbServiceMock: Partial<DbService>;

    beforeAll(() => {
        const errorFunc = common.Logger.error.bind(common.Logger);
        common.Logger.error = (message, trace, context) => {
            errorFunc(message, '', context);
        };
    });

    beforeEach(() => {
        dbServiceMock = {
            getConnection: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    find: jest.fn(),
                    findOne: jest.fn(),
                    deleteOne: jest.fn(),
                    replaceOne: jest.fn(),
                    insertOne: jest.fn(),
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

    it('should get all students successfuly on getUsersByFilters', async () => {
        (dbServiceMock.getConnection().collection('users').find as jest.Mock).mockReturnValueOnce({
            toArray: jest.fn().mockReturnValueOnce([{ username: 'user1' }, { username: 'user2' }]),
        });

        const students = await usersPersistanceService.getUsersByFilters({role: UserRole.STUDENT});
        expect(students).toEqual([{ username: 'user1' }, { username: 'user2' }]);
    });

    it('should throw an error on error through getUsersByFilters function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection('users').find as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await usersPersistanceService.getUsersByFilters({role: UserRole.STUDENT}).catch((error) => expect(error).not.toBeUndefined());
    });

    // TODO: fix it also Stryker does not recognize xit
    // xit('should get one student successfuly on getUserByFilters', async () => {
    //     (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
    //         username: 'student1',
    //     });

    //     const student = await usersPersistanceService.getUserByFilters({role: UserRole.STUDENT}, '123467');
    //     expect(student).toEqual({ username: 'student1' });
    // });

    it('should throw an error on error through getUserByFilters function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await usersPersistanceService.getUserByFilters({role: UserRole.STUDENT}, '123467').catch((error) => expect(error).not.toBeUndefined());
    });

    it('should get user successfully on getById', async () => {
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

    it('should return user from getByUsername on success', async () => {
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

    it('should return user from authenticateUser on success', async () => {
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

    it('should remove user successfuly on deleteUser', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').deleteOne as jest.Mock).mockReturnValueOnce({
            deletedCount: 1,
        });

        const [error, removedCount] = await usersPersistanceService.deleteUser('507f1f77bcf86cd799439011');

        expect(removedCount).toBe(1);
    });

    it('should return error on deleteUser when error happened', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').deleteOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        const [error, removedCount] = await usersPersistanceService.deleteUser('507f1f77bcf86cd799439011');

        expect(error).toBeDefined();
    });

    it('should update user successfuly on updateUser', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'some updated user',
        });

        const [error, updatedUser] = await usersPersistanceService.updateUser('507f1f77bcf86cd799439011', {});

        expect(updatedUser).toEqual({
            username: 'some updated user',
        });
    });

    it('should update student successfuly on updateUser', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'some updated student',
        });

        const [error, updatedUser] = await usersPersistanceService.updateUser('507f1f77bcf86cd799439011', UserRole.STUDENT);

        expect(updatedUser).toEqual({
            username: 'some updated student',
        });
    });

    it('should return error on updateUser when error happened', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').replaceOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        const [error, _] = await usersPersistanceService.updateUser('507f1f77bcf86cd799439011', {});
        expect(error).toBeDefined();
    });

    it('should create user successfuly on createUser', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'some created user',
        });

        (dbServiceMock.getConnection().collection('users').insertOne as jest.Mock).mockReturnValueOnce({
            insertedId: '507f1f77bcf86cd799439011',
        });

        const [_, createdUser] = await usersPersistanceService.createUser({});

        expect(createdUser).toEqual({
            username: 'some created user',
        });
    });

    it('should create student successfuly on createUser', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'some created student',
        });

        (dbServiceMock.getConnection().collection('users').insertOne as jest.Mock).mockReturnValueOnce({
            insertedId: '507f1f77bcf86cd799439011',
        });

        const [_, createdUser] = await usersPersistanceService.createUser({}, UserRole.STUDENT);

        expect(createdUser).toEqual({
            username: 'some created student',
        });
    });

    it('should return error on createUser when error happened', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').insertOne as jest.Mock).mockReturnValueOnce({
            insertedId: '507f1f77bcf86cd799439011',
        });
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        const [error, _] = await usersPersistanceService.createUser({});
        expect(error).toBeDefined();
    });

    it('should return users with role student on getStudentsByClassId', async () => {
        const expected = [{ username: 'student1', role: 'STUDENT' }, { username: 'student2', role: 'STUDENT' }];
        (dbServiceMock.getConnection().collection('users').find as jest.Mock).mockReturnValueOnce({
            toArray: jest.fn().mockReturnValueOnce(expected),
        });

        const [_, students] = await usersPersistanceService.getStudentsByClassId('507f1f77bcf86cd799439011');
        expect(students).toEqual(expected);
    });

    it('should return error on getStudentsByClassId when error happend', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection('users').find as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await usersPersistanceService.getStudentsByClassId('507f1f77bcf86cd799439011').catch((error) => expect(error).toBeDefined());
    });
});