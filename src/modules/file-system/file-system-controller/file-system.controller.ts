import { FileSystemDbModel } from '@models/file-system.db.model';
import { UserTokenProfile } from '@models/user-token-profile.model';
import {
  Body,
  Controller,
  Delete,
  FileInterceptor,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UserRole } from '../../../models/user.db.model';
import { AuthService } from '../../../modules/auth/auth-service/auth.service';
import { FileSystemPersistenceService } from '../../persistence/file-system.persistence.service';

const NO_PERMISSION = 'not permissions to execute command';
const ALREADY_EXIST = 'Map already exist, try update (PUT)';
@Controller('/map')
export class FileSystemController {
  private logger = new Logger('FileSystemController');
  constructor(private readonly filePersistenceService: FileSystemPersistenceService) {}
  @Post()
  @UseInterceptors(FileInterceptor('mapFilename'))
  async upload(@UploadedFile() file, @Req() req, @Body() body, @Res() res: Response) {
    if (!this.checkPermission(req.headers.authorization, res)) {
      return;
    }
    if (body.floor === undefined || body.floor === null) {
      sendBack(res, HttpStatus.BAD_REQUEST, null);
    }
    try {
      const existMap = await this.filePersistenceService.getFileByFilters({ description: body.floor });
      if (existMap !== null) {
        sendBack(res, HttpStatus.BAD_REQUEST, ALREADY_EXIST);
        return;
      }
    } catch (error) {
      this.logger.error('this.filePersistenceService.createFile failed to check exist');
      sendBack(res, HttpStatus.INTERNAL_SERVER_ERROR, null);
    }
    if (!checkFile(file)) {
      sendBack(res, HttpStatus.BAD_REQUEST, null);
      return;
    }
    const newFile = createNewFile(file, body);
    try {
      await this.filePersistenceService.createFile(newFile);
      sendBack(res, HttpStatus.CREATED, null);
    } catch (error) {
      this.errorHandle(res, 'create');
    }
  }

  @Delete(':floor')
  @UseInterceptors(FileInterceptor('mapFilename'))
  async delete(@Param('floor') floor: string, @Req() req, @Res() res: Response) {
    if (!this.checkPermission(req.headers.authorization, res)) {
      return;
    }
    try {
      const existMap = await this.filePersistenceService.getFileByFilters({ description: floor });
      if (!existMap) {
        sendBack(res, HttpStatus.NOT_FOUND, null);
        return;
      }
      await this.filePersistenceService.deleteFile(existMap._id);
      sendBack(res, HttpStatus.NO_CONTENT, null);
    } catch (err) {
      this.errorHandle(res, 'delete');
    }
  }

  @Put(':floor')
  @UseInterceptors(FileInterceptor('mapFilename'))
  async update(@Param('floor') floor: string, @UploadedFile() file, @Req() req, @Res() res: Response) {
    if (!this.checkPermission(req.headers.authorization, res)) {
      return;
    }
    try {
      const existMap = await this.filePersistenceService.getFileByFilters({ description: floor });
      if (!existMap) {
        sendBack(res, HttpStatus.NOT_FOUND, null);
        return;
      }
      if (existMap._id === undefined || existMap._id === null) {
        throw new Error('error: mongo file without id');
      }

      if (!checkFile(file)) {
        sendBack(res, HttpStatus.BAD_REQUEST, null);
        return;
      }
      const newFile: FileSystemDbModel = {
        content: file,
        description: floor,
        filename: file.originalname,
      };
      delete newFile.content.fieldname;

      await this.filePersistenceService.updateFile(existMap._id, newFile);
      sendBack(res, HttpStatus.OK, null);
    } catch (err) {
      this.errorHandle(res, 'update');
    }
  }

  @Get(':floor')
  async get(@Param('floor') floor: string, @Req() req, @Res() res: Response): Promise<void> {
    const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(req.headers.authorization);
    if (userProfile === null) {
      sendBack(res, HttpStatus.FORBIDDEN, null);
      return;
    }
    try {
      const existMap = await this.filePersistenceService.getFileByFilters({ description: floor });
      if (!existMap) {
        sendBack(res, HttpStatus.NOT_FOUND, null);
        return;
      }
      sendBack(res, HttpStatus.OK, existMap);
    } catch (err) {
      this.errorHandle(res, 'get');
    }
  }
  private errorHandle(res: Response, sourceFunction: string) {
    this.logger.error(`this.filePersistenceService.${sourceFunction} failed`);
    sendBack(res, HttpStatus.INTERNAL_SERVER_ERROR, null);
  }

  private checkPermission(token: string, res: Response) {
    const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(token);
    if (userProfile === null || userProfile.role !== UserRole.PRINCIPLE) {
      sendBack(res, HttpStatus.FORBIDDEN, NO_PERMISSION);
      return false;
    }
    return true;
  }
}
function sendBack(res: Response, code: HttpStatus, message: any) {
  res.status(code);
  res.send(message);
}

function createNewFile(file: any, body: any): FileSystemDbModel {
  let newFile: FileSystemDbModel = null;
  newFile = {
    content: file,
    description: body.floor,
    filename: file.originalname,
  };
  delete newFile.content.fieldname;
  return newFile;
}

function checkFile(file: any): boolean {
  if (file.originalname === undefined) {
    return false;
  }
  if (file.encoding === undefined) {
    return false;
  }
  if (file.mimetype === undefined) {
    return false;
  }
  if (file.buffer === undefined) {
    return false;
  }
  if (file.size === undefined) {
    return false;
  }
  return true;
}
