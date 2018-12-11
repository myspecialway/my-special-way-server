import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';
import { NonActiveTimePersistenceService } from './non-active-time.persistence.service';
import { NonActiveTimeDbModel } from '../../models/non-active-time.db.model';

describe('non active time persistence', () => {
  const collectionName = 'non-active-times';
  let nonActiveTimePersistenceService: NonActiveTimePersistenceService;
  let dbServiceMock: Partial<DbService>;
  beforeEach(() => {
    dbServiceMock = {
      getConnection: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn(),
          findOne: jest.fn(),
          deleteOne: jest.fn(),
          replaceOne: jest.fn(),
          findOneAndUpdate: jest.fn(),
          insertOne: jest.fn(),
        } as Partial<Collection>),
      } as Partial<Db>),
    };
    nonActiveTimePersistenceService = new NonActiveTimePersistenceService(dbServiceMock as DbService);
  });

  it('should get all non active times successfully on getAll', async () => {
    (dbServiceMock.getConnection().collection(collectionName).find as jest.Mock).mockReturnValueOnce({
      sort: jest.fn().mockReturnValueOnce({
        toArray: jest.fn().mockReturnValueOnce([{ name: 'non active time 1' }, { name: 'non active time 2' }]),
      }),
    });

    const nonActiveTimes = await nonActiveTimePersistenceService.getAll();
    expect(nonActiveTimes).toEqual([{ name: 'non active time 1' }, { name: 'non active time 2' }]);
  });

  it('should throw an error on error through getAll function', async () => {
    expect.assertions(1);
    (dbServiceMock.getConnection().collection(collectionName).find as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await nonActiveTimePersistenceService.getAll().catch((error) => expect(error).not.toBeUndefined());
  });

  it('should create a new non active time successfully on createNonActiveTime', async () => {
    expect.hasAssertions();
    const expected = {
      _id: '507f1f77bcf86cd799439011',
      title: 'best title ever!',
      isAllDayEvent: false,
      startDateTime: 1234,
      endDateTime: 5678,
      isAllClassesEvent: false,
      classesIds: ['1', '2', '3'],
    };
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce(expected);
    (dbServiceMock.getConnection().collection(collectionName).insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });

    const createdNonActiveTIme = await nonActiveTimePersistenceService.create(expected);

    expect(createdNonActiveTIme).toEqual(expected);
  });

  it('should return error on createClass when error happened', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await nonActiveTimePersistenceService.create(null).catch((error) => expect(error).not.toBeUndefined());
  });

  it('should update non active time successfully on updateNonActiveTime', async () => {
    expect.hasAssertions();
    const expected: NonActiveTimeDbModel = {
      _id: '507f1f77bcf86cd799439011',
      title: 'best title ever!',
      isAllDayEvent: false,
      startDateTime: 1234,
      endDateTime: 5678,
      isAllClassesEvent: false,
      classesIds: ['1', '2', '3'],
    };
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce(expected);
    (dbServiceMock.getConnection().collection(collectionName).findOneAndUpdate as jest.Mock).mockReturnValueOnce({
      value: expected,
    });

    const updatedNonActiveEvent = await nonActiveTimePersistenceService.update('507f1f77bcf86cd799439011', expected);

    expect(updatedNonActiveEvent).toEqual(expected);
  });

  it('should return error on UpdateNonActiveTime when error happened', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOneAndUpdate as jest.Mock).mockImplementationOnce(
      () => {
        throw new Error('mock error');
      },
    );

    await nonActiveTimePersistenceService
      .update('507f1f77bcf86cd799439011', null)
      .catch((error) => expect(error).toBeDefined());
  });

  it('should delete non active time successfully on deleteNonActiveTime', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).deleteOne as jest.Mock).mockReturnValueOnce({
      deletedCount: 1,
    });

    const removedCount = await nonActiveTimePersistenceService.delete('507f1f77bcf86cd799439011');

    expect(removedCount).toBe(1);
  });

  it('should return error on deleteNonActiveTime when error happened', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).deleteOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await nonActiveTimePersistenceService
      .delete('507f1f77bcf86cd799439011')
      .catch((error) => expect(error).toBeDefined());
  });
});
