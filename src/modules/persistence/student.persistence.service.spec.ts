import * as common from '@nestjs/common';
import { StudentPersistenceService } from './student.persistence.service';
import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';

describe('student persistence', () => {
    let studentPersistanceService: StudentPersistenceService;
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

        studentPersistanceService = new StudentPersistenceService(dbServiceMock as DbService);
    });

    it('should get all students successfuly on getAll', async () => {
        (dbServiceMock.getConnection().collection('users').find as jest.Mock).mockReturnValueOnce({
            toArray: jest.fn().mockReturnValueOnce([{ username: 'student1' }, { username: 'student2' }]),
        });

        const users = await studentPersistanceService.getAll();
        expect(users).toEqual([{ username: 'student1' }, { username: 'student2' }]);
    });

    it('should throw an error on error through getAll function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection('users').find as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await studentPersistanceService.getAll().catch((error) => expect(error).not.toBeUndefined());
    });

    it('should get student successfully on getById', async () => {
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'student1',
        });

        const users = await studentPersistanceService.getById('507f1f77bcf86cd799439011');
        expect(users).toEqual({ username: 'student1' });
    });

    it('should throw an error on error through getById function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await studentPersistanceService.getById('507f1f77bcf86cd799439011')
            .catch((error) => expect(error).not.toBeUndefined());
    });

    it('should call db.getConnection only once', async () => {
        expect.assertions(1);

        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'user1',
        });

        await studentPersistanceService.getById('507f1f77bcf86cd799439011');
        await studentPersistanceService.getById('507f1f77bcf86cd799439011');
        await studentPersistanceService.getById('507f1f77bcf86cd799439011');
        await studentPersistanceService.getById('507f1f77bcf86cd799439011');

        // this function gets called 2 times because first time it's been called via the test itself
        // this needs to be refactored

        expect(dbServiceMock.getConnection).toHaveBeenCalledTimes(2);
    });

    it('should return student from getByUsername on success', async () => {
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'student1',
        });

        const [error, student] = await studentPersistanceService.getByUsername('someUsername');

        expect(error).toBeNull();
        expect(student).toEqual({ username: 'student1' });
    });

    it('should return an error on persistance error', async () => {
        expect.hasAssertions();

        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        const [error, user] = await studentPersistanceService.getByUsername('someUsername');

        expect(error).toBeDefined();
    });

    it(`should return user and error nulls if student hasn't been found`, async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce(null);

        const [error, user] = await studentPersistanceService.getByUsername('someUsername');

        expect(error).toBeNull();
        expect(user).toBeNull();
    });

    it('should return student from authenticateUser on success', async () => {
        expect.hasAssertions();

        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'student1',
        });

        const [error, user] = await studentPersistanceService.authenticateUser('someUsername');

        expect(error).toBeNull();
        expect(user).toEqual({ username: 'student1' });
    });

    it('should return an error on authenticateUser error', async () => {
        expect.hasAssertions();

        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        const [error, user] = await studentPersistanceService.authenticateUser('someUsername');

        expect(error).toBeDefined();
        expect(user).toBeNull();
    });

    it('should remove user successfuly on deleteUser', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').deleteOne as jest.Mock).mockReturnValueOnce({
            deletedCount: 1,
        });

        const [error, removedCount] = await studentPersistanceService.deleteUser('507f1f77bcf86cd799439011');

        expect(removedCount).toBe(1);
    });

    it('should return error on deleteUser when error happened', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').deleteOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        const [error, removedCount] = await studentPersistanceService.deleteUser('507f1f77bcf86cd799439011');

        expect(error).toBeDefined();
    });

    it('should update user successfuly on updateUser', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').findOne as jest.Mock).mockReturnValueOnce({
            username: 'some updated user',
        });

        const [error, updatedUser] = await studentPersistanceService.updateUser('507f1f77bcf86cd799439011', {});

        expect(updatedUser).toEqual({
            username: 'some updated user',
        });
    });

    it('should return error on updateUser when error happened', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection('users').replaceOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        const [error, _] = await studentPersistanceService.updateUser('507f1f77bcf86cd799439011', {});
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

        const [_, createdUser] = await studentPersistanceService.createUser({});

        expect(createdUser).toEqual({
            username: 'some created user',
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

        const [error, _] = await studentPersistanceService.createUser({});
        expect(error).toBeDefined();
    });

    it('should return users with role student on getStudentsByClassId', async () => {
        const expected = [{ username: 'student1', role: 'STUDENT' }, { username: 'student2', role: 'STUDENT' }];
        (dbServiceMock.getConnection().collection('users').find as jest.Mock).mockReturnValueOnce({
            toArray: jest.fn().mockReturnValueOnce(expected),
        });

        const [_, students] = await studentPersistanceService.getStudentsByClassId('507f1f77bcf86cd799439011');
        expect(students).toEqual(expected);
    });

    it('should return error on getStudentsByClassId when error happend', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection('users').find as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await studentPersistanceService.getStudentsByClassId('507f1f77bcf86cd799439011').catch((error) => expect(error).toBeDefined());
    });
});