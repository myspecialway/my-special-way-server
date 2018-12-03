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
    const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(req.headers.authorization);
    if (userProfile === null || userProfile.role !== UserRole.PRINCIPLE) {
      res.status(HttpStatus.FORBIDDEN);
      res.send(NO_PERMISSION);
      return;
    }
    if (body.floor === undefined || body.floor === null) {
      res.status(HttpStatus.BAD_REQUEST);
      res.send();
    }
    try {
      const existMap = await this.filePersistenceService.getFileByFilters({ description: body.floor });
      if (existMap !== null) {
        res.status(HttpStatus.BAD_REQUEST);
        res.send(ALREADY_EXIST);
        return;
      }
    } catch (error) {
      this.logger.error('this.filePersistenceService.createFile failed to check exist');
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send();
    }
    let newFile: FileSystemDbModel = null;
    if (!checkFile(file)) {
      res.status(HttpStatus.BAD_REQUEST);
      res.send();
      return;
    }
    newFile = {
      content: file,
      description: body.floor,
      filename: file.originalname,
    };
    delete newFile.content.fieldname;
    try {
      await this.filePersistenceService.createFile(newFile);
      res.status(HttpStatus.CREATED);
      res.send();
    } catch (error) {
      this.logger.error('this.filePersistenceService.createFile failed to create');
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send();
    }
  }

  @Delete(':floor')
  @UseInterceptors(FileInterceptor('mapFilename'))
  async delete(@Param('floor') floor: string, @Req() req, @Res() res: Response) {
    const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(req.headers.authorization);
    if (userProfile === null || userProfile.role !== UserRole.PRINCIPLE) {
      res.status(HttpStatus.FORBIDDEN);
      res.send(NO_PERMISSION);
      return;
    }
    try {
      const existMap = await this.filePersistenceService.getFileByFilters({ description: floor });
      if (!existMap) {
        res.status(HttpStatus.NOT_FOUND);
        res.send();
        return;
      }
      await this.filePersistenceService.deleteFile(existMap._id);
      res.status(HttpStatus.NO_CONTENT);
      res.send();
    } catch (err) {
      this.logger.error('this.filePersistenceService.delete failed');
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send();
    }
  }

  @Put(':floor')
  @UseInterceptors(FileInterceptor('mapFilename'))
  async update(@Param('floor') floor: string, @UploadedFile() file, @Req() req, @Res() res: Response) {
    const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(req.headers.authorization);
    if (userProfile === null || userProfile.role !== UserRole.PRINCIPLE) {
      res.status(HttpStatus.FORBIDDEN);
      res.send(NO_PERMISSION);
      return;
    }
    try {
      const existMap = await this.filePersistenceService.getFileByFilters({ description: floor });
      if (!existMap) {
        res.status(HttpStatus.NOT_FOUND);
        res.send();
        return;
      }
      if (existMap._id === undefined || existMap._id === null) {
        throw new Error('error: mongo file without id');
      }

      if (!checkFile(file)) {
        res.status(HttpStatus.BAD_REQUEST);
        res.send();
        return;
      }
      const newFile: FileSystemDbModel = {
        content: file,
        description: floor,
        filename: file.originalname,
      };
      delete newFile.content.fieldname;

      await this.filePersistenceService.updateFile(existMap._id, newFile);
      res.status(HttpStatus.OK);
      res.send();
    } catch (err) {
      this.logger.error('this.filePersistenceService.updateFile failed');
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send();
    }
  }

  @Get(':floor')
  async get(@Param('floor') floor: string, @Req() req, @Res() res: Response): Promise<void> {
    const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(req.headers.authorization);
    if (userProfile === null) {
      res.status(HttpStatus.FORBIDDEN);
      res.send();
      return;
    }
    try {
      const existMap = await this.filePersistenceService.getFileByFilters({ description: floor });
      if (!existMap) {
        res.status(HttpStatus.NOT_FOUND);
        res.send();
        return;
      }
      res.send(existMap);
      res.status(HttpStatus.OK);
    } catch (err) {
      this.logger.error('this.filePersistenceService.updateFile failed');
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send();
    }
  }
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
