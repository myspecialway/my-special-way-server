import { BlockedSectionsPersistenceService } from './blocked-sections.persistence.service';
import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';
import BlockedSectionsDbModel from '../../models/blocked-sections.db.model';

describe('BlockedSectionsPersistenceService', () => {
  const collectioName = 'blocked_sections';
  let blockedSectionsPersistenceService: BlockedSectionsPersistenceService;
  let dbServiceMock: Partial<DbService>;
  const blockedSectionsMock: BlockedSectionsDbModel[] = [
    {
      _id: '507f1f77bcf86cd799439012',
      from: 'A',
      to: 'B',
      reason: 'some reason',
    },
    {
      _id: '507f1f77bcf86cd799439011',
      from: 'C',
      to: 'D',
      reason: 'some reason2',
    },
  ];

  beforeEach(() => {
    dbServiceMock = {
      getConnection: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn(),
          findOne: jest.fn(),
          deleteOne: jest.fn(),
          insertOne: jest.fn(),
        } as Partial<Collection>),
      } as Partial<Db>),
    };

    blockedSectionsPersistenceService = new BlockedSectionsPersistenceService(dbServiceMock as DbService);
  });

  it('should get all blocked sections successfuly on getAll', async () => {
    (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockReturnValueOnce({
      toArray: jest.fn().mockReturnValueOnce(blockedSectionsMock),
    });

    const blockedSections = await blockedSectionsPersistenceService.getAll();
    expect(blockedSections).toEqual(blockedSectionsMock);
  });

  it('should throw an error on error through getAll function', async () => {
    expect.assertions(1);
    (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await blockedSectionsPersistenceService.getAll().catch((error) => expect(error).not.toBeUndefined());
  });

  it('should get blocked section successfully on getById', async () => {
    (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce({
      _id: '507f1f77bcf86cd799439011',
      from: 'C',
      to: 'D',
      reason: 'some reason2',
    });

    const blockedSection = await blockedSectionsPersistenceService.getById('507f1f77bcf86cd799439011');
    expect(blockedSection).toEqual({
      _id: '507f1f77bcf86cd799439011',
      from: 'C',
      to: 'D',
      reason: 'some reason2',
    });
  });

  it('should throw an error on error through getById function', async () => {
    expect.assertions(1);
    (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await blockedSectionsPersistenceService
      .getById('507f1f77bcf86cd799439011')
      .catch((error) => expect(error).not.toBeUndefined());
  });

  it('should create a new blocked section successfully on createBlockedSection', async () => {
    expect.hasAssertions();
    const expected = {
      _id: '507f1f77bcf86cd799439011',
      from: 'C',
      to: 'D',
      reason: 'some reason2',
    };
    (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(expected);
    (dbServiceMock.getConnection().collection(collectioName).insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });

    const blockedSection = await blockedSectionsPersistenceService.createBlockedSection({
      from: 'C',
      to: 'D',
      reason: 'some reason2',
    });

    expect(blockedSection).toEqual(expected);
  });

  it('should return error on createBlockedSection when error happened', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectioName).insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });
    (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await blockedSectionsPersistenceService
      .createBlockedSection({})
      .catch((error) => expect(error).not.toBeUndefined());
  });

  it('should delete blocked section successfully on deleteBlockedSection', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectioName).deleteOne as jest.Mock).mockReturnValueOnce({
      deletedCount: 1,
    });

    const removedCount = await blockedSectionsPersistenceService.deleteBlockedSection('507f1f77bcf86cd799439011');

    expect(removedCount).toBe(1);
  });

  it('should return error on deleteLocation when error happened', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectioName).deleteOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await blockedSectionsPersistenceService
      .deleteBlockedSection('507f1f77bcf86cd799439011')
      .catch((error) => expect(error).toBeDefined());
  });
});
