import { FileSystemController } from './file-system.controller';
import { FileSystemPersistenceService } from '../../persistence/file-system.persistence.service';
import { HttpStatus } from '@nestjs/common';
import { FileUtilesService } from '../services/file-utiles';
import { mockRes } from '../../../../test/express-mock/express-mock';
import { Response } from 'express';
import { ObjectID } from 'bson';
import { DbService } from '../../persistence/db.service';
import { Collection, Db } from 'mongodb';

describe('file-system controller', () => {
  const collectioName = 'fileSystem';
  let filesystemController: FileSystemController;
  let fileSystemPersistenceService: FileSystemPersistenceService;
  let dbServiceMock: Partial<DbService>;
  let res: Partial<Response>;
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
          createIndex: jest.fn(),
        } as Partial<Collection>),
      } as Partial<Db>),
    };

    res = mockRes();
    fileSystemPersistenceService = new FileSystemPersistenceService(dbServiceMock as DbService);
    filesystemController = new FileSystemController(
      fileSystemPersistenceService as FileSystemPersistenceService,
      new FileUtilesService(),
    );
  });

  describe('Upload File Tests', () => {
    let file = {};
    let body = {};
    beforeEach(() => {
      file = {};
      body = {};
    });
    it('PRINCIPLE Scenario with floor and mapName and file', async () => {
      const id = '1234567';
      body = { floor: 5, mapName: 'mapName' };
      file = {
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
        originalname: 'originalname',
      };
      (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(null);
      (dbServiceMock.getConnection().collection(collectioName).insertOne as jest.Mock).mockReturnValueOnce({
        insertedId: id,
      });

      await filesystemController.upload(file, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({ status: 'created', id });
    });

    it('PRINCIPLE Scenario with no encoding', async () => {
      body = { floor: 5, mapName: 'mapName' };
      file = {
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
        originalname: 'originalname',
      };
      (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.upload(file, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });

    it('PRINCIPLE Scenario persistence create fails fails', async () => {
      body = { floor: 5, mapName: 'mapName' };
      file = {
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
        originalname: 'originalname',
      };
      (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(null);
      (dbServiceMock.getConnection().collection(collectioName).insertOne as jest.Mock).mockImplementation(() => {
        throw new Error('mongo db error');
      });

      await filesystemController.upload(file, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('Delete File Tests', () => {
    it('Scenario for delete file', async () => {
      const id = new ObjectID().toString();
      (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce({ _id: id });
      (dbServiceMock.getConnection().collection(collectioName).deleteOne as jest.Mock).mockReturnValueOnce({ id });
      await filesystemController.deleteMap(id, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
    });
    it('PRINCIPLE Scenario persistence delete fails', async () => {
      const id = new ObjectID().toString();
      (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce({ _id: id });
      (dbServiceMock.getConnection().collection(collectioName).deleteOne as jest.Mock).mockImplementationOnce(() => {
        throw new Error('can not delete file');
      });
      await filesystemController.deleteMap(id, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
    it('PRINCIPLE Scenario getFileByFilters delete fails', async () => {
      const id = new ObjectID().toString();
      (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(null);
      (dbServiceMock.getConnection().collection(collectioName).deleteOne as jest.Mock).mockReturnValueOnce({ id });

      await filesystemController.deleteMap(id, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('Get Files Ids', () => {
    it('Scenario for get ids', async () => {
      (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockReturnValue({
        toArray: jest.fn().mockReturnValue([{ _id: new ObjectID().toString() }, { _id: new ObjectID().toString() }]),
      });
      await filesystemController.getAllFillesIds(res as Response);
      expect(res.json).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenarifor get ids fails', async () => {
      (dbServiceMock.getConnection().collection(collectioName).find as jest.Mock).mockImplementationOnce(() => {
        throw new Error('can not delete file');
      });
      await filesystemController.getAllFillesIds(res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('Get Files map', () => {
    it('Scenario for get map', async () => {
      const obj = {
        description: 'קומה ראשונה',
        filename: 'Floor_BAEMENT_TOP_SHOT_MAP_V2.jpg',
        floor: 2,
        content: {
          mimetype: 'mimeytpe',
          buffer: 'mockbuffer',
        },
      };
      const id = new ObjectID().toString();
      (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(obj);
      await filesystemController.getMap(id, res as Response);
      expect(res.send).toHaveBeenCalled();
      expect(res.status).toBeCalledWith(200);
    });
    it('PRINCIPLE Scenarifor get metadata fails', async () => {
      const id = new ObjectID().toString();

      (dbServiceMock.getConnection().collection(collectioName).findOne as jest.Mock).mockReturnValueOnce(null);

      await filesystemController.getMap(id, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
