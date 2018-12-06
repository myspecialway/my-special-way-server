import { FileSystemController } from './file-system.controller';
import { FileSystemPersistenceService } from '../../persistence/file-system.persistence.service';
import { Response } from 'express';
import { AuthService } from '../../auth/auth-service/auth.service';
import { UserRole } from '../../../models/user.db.model';
import { HttpStatus } from '@nestjs/common';
describe('file-system controller', () => {
  let filesystemController: FileSystemController;
  let fileSystemPersistenceService: Partial<FileSystemPersistenceService>;
  let res: Partial<Response>;
  beforeEach(() => {
    fileSystemPersistenceService = {
      createFile: jest.fn(),
      updateFile: jest.fn(),
      deleteFile: jest.fn(),
      getFileByFilters: jest.fn(),
    };
    filesystemController = new FileSystemController(fileSystemPersistenceService as FileSystemPersistenceService);
    res = {
      send: jest.fn(),
      status: jest.fn(),
    };
    AuthService.getUserProfileFromToken = jest.fn();
    (AuthService.getUserProfileFromToken as jest.Mock).mockImplementation((auth) => {
      switch (auth) {
        case 'PRINCIPLE':
          return { role: UserRole.PRINCIPLE };
        case 'TEACHER':
          return { role: UserRole.TEACHER };
        case 'STUDENT':
          return { role: UserRole.STUDENT };
        default:
          return null;
      }
    });
  });

  describe('Upload File Tests', () => {
    let file = {};
    let req = {};
    let body = {};
    beforeEach(() => {
      file = {};
      req = {};
      body = {};
    });
    it('TEACHER Scenario', async () => {
      req = { headers: { authorization: 'TEACHER' } };
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith('not permissions to execute command');
    });
    it('STUDENT Scenario', async () => {
      req = { headers: { authorization: 'STUDENT' } };
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith('not permissions to execute command');
    });
    it('OTHER Scenario', async () => {
      req = { headers: { authorization: 'OTHER' } };
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith('not permissions to execute command');
    });
    it('PRINCIPLE Scenario without floor', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      body = {};
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario with floor = null', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      body = { floor: null };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario with existing floor', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      body = { floor: 'mockFloor' };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({});
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalledWith('Map already exist, try update (PUT)');
    });
    it('PRINCIPLE Scenario with no file name', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      body = { floor: 'mockFloor' };
      file = {
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario with no encoding', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      body = { floor: 'mockFloor' };
      file = {
        originalname: 'mockOriginalName',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario with no mimetype', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      body = { floor: 'mockFloor' };
      file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario with no buffer', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      body = { floor: 'mockFloor' };
      file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario no size', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      body = { floor: 'mockFloor' };
      file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario persistence exist check fails', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      body = { floor: 'mockFloor' };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test');
      });
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario persistence create fails', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      body = { floor: 'mockFloor' };
      file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      (fileSystemPersistenceService.createFile as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test');
      });
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      body = { floor: 'mockFloor' };
      file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      (fileSystemPersistenceService.createFile as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.upload(file, req, body, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.send).toHaveBeenCalled();
    });
  });
  describe('Delete File Tests', () => {
    let req = {};
    beforeEach(() => {
      req = {};
    });
    it('TEACHER Scenario', async () => {
      req = { headers: { authorization: 'TEACHER' } };
      await filesystemController.delete('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith('not permissions to execute command');
    });
    it('STUDENT Scenario', async () => {
      req = { headers: { authorization: 'STUDENT' } };
      await filesystemController.delete('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith('not permissions to execute command');
    });
    it('OTHER Scenario', async () => {
      req = { headers: { authorization: 'OTHER' } };
      await filesystemController.delete('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith('not permissions to execute command');
    });
    it('PRINCIPLE Scenario not found', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.delete('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario persistence exist check fails', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test');
      });
      await filesystemController.delete('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario persistence delete fails', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({});
      (fileSystemPersistenceService.deleteFile as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test');
      });
      await filesystemController.delete('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({});
      (fileSystemPersistenceService.deleteFile as jest.Mock).mockReturnValueOnce({});
      await filesystemController.delete('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(res.send).toHaveBeenCalled();
    });
  });
  describe('Update File Tests', () => {
    let file = {};
    let req = {};
    beforeEach(() => {
      file = {};
      req = {};
    });
    it('TEACHER Scenario', async () => {
      req = { headers: { authorization: 'TEACHER' } };
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith('not permissions to execute command');
    });
    it('STUDENT Scenario', async () => {
      req = { headers: { authorization: 'STUDENT' } };
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith('not permissions to execute command');
    });
    it('OTHER Scenario', async () => {
      req = { headers: { authorization: 'OTHER' } };
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith('not permissions to execute command');
    });
    it('PRINCIPLE Scenario not found', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario with no file name', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      file = {
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({ _id: 'mockId' });
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario with no encoding', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      file = {
        originalname: 'mockOriginalName',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({ _id: 'mockId' });
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario with no mimetype', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({ _id: 'mockId' });
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario with no buffer', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({ _id: 'mockId' });
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario no size', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({ _id: 'mockId' });
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario persistence exist check fails', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test');
      });
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario persistence exist return no id', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({});
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario persistence exist return null id', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({ _id: null });
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario persistence update fails', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({});
      (fileSystemPersistenceService.updateFile as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test');
      });
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce({ _id: 'mockId' });
      (fileSystemPersistenceService.updateFile as jest.Mock).mockReturnValueOnce({});
      await filesystemController.update('floorMock', file, req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalled();
    });
  });
  describe('Get File Tests', () => {
    let req = {};
    beforeEach(() => {
      req = {};
    });
    it('NO EXIST ROLE Scenario', async () => {
      req = { headers: { authorization: 'NO EXIST ROLE' } };
      await filesystemController.get('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario not found', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(null);
      await filesystemController.get('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalled();
    });
    it('PRINCIPLE Scenario persistence exist check fails', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockImplementationOnce(() => {
        throw new Error('test');
      });
      await filesystemController.get('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalled();
    });
    it('TEACHER Scenario', async () => {
      req = { headers: { authorization: 'TEACHER' } };
      const file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(file);
      await filesystemController.get('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(file);
    });
    it('STUDENT Scenario', async () => {
      req = { headers: { authorization: 'STUDENT' } };
      const file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(file);
      await filesystemController.get('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(file);
    });
    it('PRINCIPLE Scenario', async () => {
      req = { headers: { authorization: 'PRINCIPLE' } };
      const file = {
        originalname: 'mockOriginalName',
        encoding: 'mockEncoding',
        mimetype: 'mockmimetype',
        buffer: 'mockBuffer',
        size: 'mockSize',
      };
      (fileSystemPersistenceService.getFileByFilters as jest.Mock).mockReturnValueOnce(file);
      await filesystemController.get('floorMock', req, res as Response);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(file);
    });
  });
});
