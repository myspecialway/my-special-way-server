import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';
import * as common from '@nestjs/common';
import { FileSystemPersistenceService } from './file-system.persistence.service';
import { FileSystemDbModel } from '../../models/file-system.db.model';

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
      (dbServiceMock.getConnection().collection(collectioName).insertOne as jest.Mock).mockReturnValueOnce({
        some: 'some',
      });
      await fileSystemPersistenceService.createFile({ some: 'some' });
      expect(dbServiceMock.getConnection().collection(collectioName).insertOne).toHaveBeenCalled();
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
        await fileSystemPersistenceService.createFile({ some: 'some' });
      } catch (error) {
        expect((error as Error).message).toBe('test');
      }
      expect(common.Logger.error).toHaveBeenCalled();
    });
  });

  describe('# Get File by filter', () => {
    function getFileMock(): FileSystemDbModel {
      return {
        _id: 'mockID',
        content: 'mockContent',
        description: 'mockDescription',
        filename: 'mockFileName',
      };
    }
    it('should get one file', async () => {
      (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(getFileMock());
      const resp = await fileSystemPersistenceService.getFileByFilters({ some: 'some' });
      expect(resp).toEqual(getFileMock());
    });
    it('should build filter', async () => {
      (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(getFileMock());
      await fileSystemPersistenceService.getFileByFilters({ some: 'some' });
      expect(dbServiceMock.getConnection().collection(collectioName).findOne).toHaveBeenCalledWith({ some: 'some' });
    });
    it('should log error when db cannot get', async () => {
      (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockImplementation(() => {
        throw new Error('test');
      });
      common.Logger.error = jest.fn();
      (common.Logger.error as jest.Mock).mockImplementation((message, trace, context) => {
        expect(message).toEqual('getFileByFilters:: error fetching user by parameters');
      });
      try {
        await fileSystemPersistenceService.getFileByFilters({ some: 'some' });
      } catch (error) {
        expect((error as Error).message).toBe('test');
      }
      expect(common.Logger.error).toHaveBeenCalled();
    });
  });

  describe('# Delete File', () => {
    it('should delete one file', async () => {
      (dbServiceMock.getConnection().collection(collectioName).deleteOne as jest.Mock).mockReturnValueOnce({
        some: 'some',
      });
      await fileSystemPersistenceService.deleteFile('test');
      expect(dbServiceMock.getConnection().collection(collectioName).deleteOne).toHaveBeenCalled();
    });
    it('should log error when db cannot delete', async () => {
      (dbServiceMock.getConnection().collection(collectioName).deleteOne as jest.Mock).mockImplementation(() => {
        throw new Error('test');
      });
      common.Logger.error = jest.fn();
      (common.Logger.error as jest.Mock).mockImplementation((message, trace, context) => {
        expect(message).toBe('FileSystemPersistenceService::deleteFile:: error delete File');
      });
      try {
        await fileSystemPersistenceService.deleteFile('test');
      } catch (error) {
        expect((error as Error).message).toBe('test');
      }
      expect(common.Logger.error).toHaveBeenCalled();
    });
  });

  describe('# Update File', () => {
    function getFileMock(): FileSystemDbModel {
      return {
        _id: 'mockID',
        content: 'mockContent',
        description: 'mockDescription',
        filename: 'mockFileName',
      };
    }
    it('should update one file', async () => {
      (dbServiceMock.getConnection().collection(collectioName).findOneAndReplace as jest.Mock).mockReturnValueOnce(
        getFileMock(),
      );
      await fileSystemPersistenceService.updateFile('test', getFileMock());
      expect(dbServiceMock.getConnection().collection(collectioName).findOneAndReplace).toHaveBeenCalled();
    });
    it('should log error when db cannot delete', async () => {
      (dbServiceMock.getConnection().collection(collectioName).findOneAndReplace as jest.Mock).mockImplementation(
        () => {
          throw new Error('test');
        },
      );
      common.Logger.error = jest.fn();
      (common.Logger.error as jest.Mock).mockImplementation((message, trace, context) => {
        expect(message).toBe('FileSystemPersistenceService::updateFile:: error update File');
      });
      try {
        await fileSystemPersistenceService.updateFile('test', getFileMock());
      } catch (error) {
        expect((error as Error).message).toBe('test');
      }
      expect(common.Logger.error).toHaveBeenCalled();
    });
  });
});
