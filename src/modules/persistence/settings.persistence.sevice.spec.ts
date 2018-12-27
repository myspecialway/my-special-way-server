import { DbService } from './db.service';
import { SettingsPersistenceService } from './settings.persistence.service';
import { Collection, Db } from 'mongodb';

describe('settings persistence', () => {
  const collectionName = 'settings';
  let settingsPersistenceService: SettingsPersistenceService;
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

    settingsPersistenceService = new SettingsPersistenceService(dbServiceMock as DbService);
  });

  it('should get all settings successfuly on getAll', async () => {
    (dbServiceMock.getConnection().collection(collectionName).find as jest.Mock).mockReturnValueOnce({
      toArray: jest.fn().mockReturnValueOnce([{ teachercode: '1234' }]),
    });
    const settings = await settingsPersistenceService.getAll();
    expect(settings).toEqual([{ teachercode: '1234' }]);
  });

  it('should throw an error on error through getAll function', async () => {
    expect.assertions(1);
    (dbServiceMock.getConnection().collection(collectionName).find as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });
    await settingsPersistenceService.getAll().catch((error) => expect(error).not.toBeUndefined());
  });

  it('should update settings successfuly when updating to teachercode that taken by this settings', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce({
      teachercode: 1234,
      _id: '507f1f77bcf86cd799439011',
    });
    (dbServiceMock.getConnection().collection(collectionName).findOneAndUpdate as jest.Mock).mockReturnValueOnce({
      value: { teachercode: 23456 },
    });
    const [error, updateSettings] = await settingsPersistenceService.updateSettings('507f1f77bcf86cd799439011', {
      teachercode: 23456,
    });
    expect(updateSettings).toEqual({ teachercode: 23456 });
  });

  it('should return error on updateSettings when error happened', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    const [error, _] = await settingsPersistenceService.updateSettings('507f1f77bcf86cd799439011', {});
    expect(error).toBeDefined();
  });
});
