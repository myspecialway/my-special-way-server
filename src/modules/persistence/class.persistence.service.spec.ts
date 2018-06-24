import { ClassPersistenceService } from './class.persistence.service';
import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';

describe('class persistence', () => {
    const collectioName = 'classes';
    let classPersistanceService: ClassPersistenceService;
    let dbServiceMock: Partial<DbService>;
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

        classPersistanceService = new ClassPersistenceService(dbServiceMock as DbService);
    });

    it('should get all classes successfuly on getAll', async () => {
        (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockReturnValueOnce({
            toArray: jest.fn().mockReturnValueOnce([{ name: 'class1' }, { name: 'class2' }]),
        });

        const classes = await classPersistanceService.getAll();
        expect(classes).toEqual([{ name: 'class1' }, { name: 'class2' }]);
    });
    it('should throw an error on error through getAll function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await classPersistanceService.getAll().catch((error) => expect(error).not.toBeUndefined());
    });

    it('should get class sucessfully on getById', async () => {
        (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce({
            name: 'class1',
        });

        const clss = await classPersistanceService.getById('507f1f77bcf86cd799439011');
        expect(clss).toEqual({ name: 'class1' });
    });

    it('should get class successfully on getByname', async () => {
        (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce({
            name: 'someclassName',
        });
        const clss = await classPersistanceService.getByName('someclassName');
        expect(clss).toEqual({ name: 'someclassName' });
    });

    it('should throw an error on error through getById function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await classPersistanceService.getById('507f1f77bcf86cd799439011')
            .catch((error) => expect(error).not.toBeUndefined());
    });

    it('should throw an error on error through getByName function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await classPersistanceService.getByName('someclassName')
            .catch((error) => expect(error).not.toBeUndefined());
    });

    it('should call db.getConnection only once', async () => {
        expect.assertions(1);

        (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce({
            name: 'class1',
        });

        await classPersistanceService.getById('507f1f77bcf86cd799439011');
        await classPersistanceService.getById('507f1f77bcf86cd799439011');
        await classPersistanceService.getById('507f1f77bcf86cd799439011');
        await classPersistanceService.getById('507f1f77bcf86cd799439011');

        // this function gets called 2 times because first time it's been called via the test itself
        // this needs to be refactored

        expect(dbServiceMock.getConnection).toHaveBeenCalledTimes(2);
    });

    it('should create a new class successfully on createClass', async () => {
        expect.hasAssertions();
        const expected = { name: 'classname' };
        (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(expected);
        (dbServiceMock.getConnection().collection(collectioName).insertOne as jest.Mock).mockReturnValueOnce({
            insertedId: '507f1f77bcf86cd799439011',
        });

        const createdClass = await classPersistanceService.createClass({});

        expect(createdClass).toEqual(expected);
    });

    it('should return error on createClass when error happened', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection(collectioName).insertOne as jest.Mock).mockReturnValueOnce({
            insertedId: '507f1f77bcf86cd799439011',
        });
        (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await classPersistanceService.createClass({}).catch((error) => expect(error).not.toBeUndefined());
    });

    it('should update class sucessfuly on updateClass', async () => {
        expect.hasAssertions();
        const expected = { name: 'classname' };
        (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(expected);

        const updatedClass = await classPersistanceService.updateClass('507f1f77bcf86cd799439011', {});

        expect(updatedClass).toEqual(expected);
    });

    it('should return error on UpdateClass when error happened', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection(collectioName).replaceOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await classPersistanceService.updateClass('507f1f77bcf86cd799439011', {}).catch((error) => expect(error).toBeDefined());
    });

    it('should delete class successfully on deleteClass', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection(collectioName).deleteOne as jest.Mock).mockReturnValueOnce({
            deletedCount: 1,
        });

        const removedCount = await classPersistanceService.deleteClass('507f1f77bcf86cd799439011');

        expect(removedCount).toBe(1);
    });

    it('should return error on deleteClass when error happened', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection(collectioName).deleteOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await classPersistanceService.deleteClass('507f1f77bcf86cd799439011').catch((error) => expect(error).toBeDefined());
    });
});