import { DbService } from './db.service';
import { Collection, Db, ObjectID } from 'mongodb';
import * as common from '@nestjs/common';
import { FileSystemPersistenceService } from './file-system.persistence.service';
import { FileSystemDbModel } from '../../models/file-system.db.model';
import { InternalServerErrorException } from '@nestjs/common';

describe('File Persistence Service', () => {
  const collectioName = 'fileSystem';
  let fileSystemPersistenceService: FileSystemPersistenceService;
  let dbServiceMock: Partial<DbService>;
  beforeEach(() => {
    dbServiceMock = {
      getConnection: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn(),
          findOne: jest.fn(),
          deleteOne: jest.fn(),
          findOneAndReplace: jest.fn(),
          insertOne: jest.fn(),
        } as Partial<Collection>),
      } as Partial<Db>),
    };
    const errorFunc = common.Logger.error.bind(common.Logger);
    common.Logger.error = (message, trace, context) => {
      errorFunc(message, '', context);
    };
    fileSystemPersistenceService = new FileSystemPersistenceService(dbServiceMock as DbService);
  });

  describe('# Create File', () => {
    it('should create one file', async () => {
      const obj = {
        insertedId: new ObjectID(),
      };
      (dbServiceMock.getConnection().collection(collectioName).insertOne as jest.Mock).mockReturnValueOnce(obj);
      const id = await fileSystemPersistenceService.createFile({ file: 'some demmy file' });
      expect(dbServiceMock.getConnection().collection(collectioName).insertOne).toHaveBeenCalled();
      expect(id).toEqual(obj.insertedId.toString());
    });
    it('should log error when db cannot create', async () => {
      (dbServiceMock.getConnection().collection(collectioName).insertOne as jest.Mock).mockImplementation(() => {
        throw new Error('test');
      });
      common.Logger.error = jest.fn();
      (common.Logger.error as jest.Mock).mockImplementation((message, trace, context) => {
        expect(message).toBe('FileSystemPersistenceService::createFile:: error create File');
      });
      try {
        await fileSystemPersistenceService.createFile({ file: 'some demmy file' });
      } catch (error) {
        expect((error as InternalServerErrorException).message.message).toBe('can not insert file to db');
      }
      expect(common.Logger.error).toHaveBeenCalled();
    });
  });
});
