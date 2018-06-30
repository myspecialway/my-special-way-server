import { LessonPersistenceService } from './lesson.persistence.service';
import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';

describe('lesson persistence', () => {
    const collectioName = 'lessons';
    let lessonPersistenceService: LessonPersistenceService;
    let dbServiceMock: Partial<DbService>;

    beforeEach(() => {
        dbServiceMock = {
            getConnection: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    find: jest.fn(),
                    findOne: jest.fn(),
                    deleteOne: jest.fn(),
                    findOneAndUpdate: jest.fn(),
                    insertOne: jest.fn(),
                } as Partial<Collection>),
            } as Partial<Db>),
        };

        lessonPersistenceService = new LessonPersistenceService(dbServiceMock as DbService);
    });

    it('should get all lessons successfuly on getAll', async () => {
        const expected = [{ title: 'lesson1' }, { title: 'lesson2' }];
        (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockReturnValueOnce({
            toArray: jest.fn().mockReturnValueOnce(expected),
        });

        const result = await lessonPersistenceService.getAll();
        expect(result).toEqual(expected);
    });

    it('should throw an error on error through getAll function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await lessonPersistenceService.getAll().catch((error) => expect(error).not.toBeUndefined());
    });

    it('should create a new lesson successfully on createLesson', async () => {
        expect.hasAssertions();
        const expected = { title: 'mylesson', icon: 'myicon' };
        (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(expected);
        (dbServiceMock.getConnection().collection(collectioName).insertOne as jest.Mock).mockReturnValueOnce({
            insertedId: '507f1f77bcf86cd799439011',
        });

        const createdLesson = await lessonPersistenceService.createLesson(expected);

        expect(createdLesson).toEqual(expected);
    });

    it('should return error on createLesson when error happened', async () => {
        expect.hasAssertions();
        const mock = { title: 'mylesson', icon: 'myicon' };
        (dbServiceMock.getConnection().collection(collectioName).insertOne as jest.Mock).mockReturnValueOnce({
            insertedId: '507f1f77bcf86cd799439011',
        });
        (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await lessonPersistenceService.createLesson(mock).catch((error) => expect(error).toBeDefined());
    });

    it('should update lesson sucessfuly on updateLesson', async () => {
        expect.hasAssertions();
        const newLesson = { title: 'myUpdatedLesson' };
        const currentLesson = {title: 'mylesson', icon: 'myicon'};
        const expected = { title: 'myUpdatedLesson', icon: 'myicon'};
        (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(currentLesson);

        const updatedLesson = await lessonPersistenceService.updateLesson('507f1f77bcf86cd799439011', newLesson);

        expect(updatedLesson).toEqual(expected);
    });

    it('should return error on updateLesson when error happened', async () => {
        expect.hasAssertions();
        const mock = { title: 'mylesson', icon: 'myicon' };
        (dbServiceMock.getConnection().collection(collectioName).findOneAndUpdate as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await lessonPersistenceService.updateLesson('507f1f77bcf86cd799439011', mock).catch((error) => expect(error).toBeDefined());
    });

    it('should delete lesson successfully on deleteLesson', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection(collectioName).deleteOne as jest.Mock).mockReturnValueOnce({
            deletedCount: 1,
        });

        const removedCount = await lessonPersistenceService.deleteLesson('507f1f77bcf86cd799439011');

        expect(removedCount).toBe(1);
    });

    it('should return error on deleteLesson when error happened', async () => {
        expect.hasAssertions();
        (dbServiceMock.getConnection().collection(collectioName).deleteOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await lessonPersistenceService.deleteLesson('507f1f77bcf86cd799439011').catch((error) => expect(error).toBeDefined());
    });
});