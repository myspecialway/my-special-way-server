import { Response } from 'express';
import {
  Controller,
  Res,
  Post,
  Req,
  Get,
  Body,
  HttpStatus,
  UseInterceptors,
  FileInterceptor,
  UploadedFile,
  Param,
  Put,
  Logger,
  Delete,
} from '@nestjs/common';
import { FileSystemPersistenceService } from '../../persistence/file-system.persistence.service';
import { FileSystemDbModel } from '@models/file-system.db.model';
import { AuthService } from '../../../modules/auth/auth-service/auth.service';
import { UserTokenProfile } from '@models/user-token-profile.model';
import { UserRole } from '../../../models/user.db.model';
const NO_PERMISSION = 'not permissions to execute command';
const ALREADY_EXIST = 'Map already exist, try update (PUT)';
@Controller('/map')
export class FileSystemController {
  private logger = new Logger('FileSystemController');
  constructor(private filePersistenceService: FileSystemPersistenceService) {}
  @Post()
  @UseInterceptors(FileInterceptor('mapFilename'))
  async upload(@UploadedFile() file, @Req() req, @Body() body, @Res() res: Response) {
    const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(req.headers.authorization);
    if (userProfile.role !== UserRole.PRINCIPLE) {
      res.sendStatus(HttpStatus.FORBIDDEN).send(NO_PERMISSION);
      return;
    }
    const existMap = await this.filePersistenceService.getFileByFilters({ description: body.floor });
    if (existMap !== null) {
      res.status(HttpStatus.BAD_REQUEST).send(ALREADY_EXIST);
      return;
    }
    let newFile: FileSystemDbModel = null;
    try {
      newFile = {
        content: file,
        description: body.floor,
        filename: file.originalname,
      };
      delete newFile.content.fieldname;
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send();
    }
    try {
      await this.filePersistenceService.createFile(newFile);
      res.status(HttpStatus.CREATED).send();
    } catch (error) {
      this.logger.error('this.filePersistenceService.createFile failed');
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  @Delete(':floor')
  @UseInterceptors(FileInterceptor('mapFilename'))
  async delete(@Param('floor') floor: string, @Req() req, @Body() body, @Res() res: Response) {
    const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(req.headers.authorization);
    if (userProfile.role !== UserRole.PRINCIPLE) {
      res.sendStatus(HttpStatus.FORBIDDEN).send(NO_PERMISSION);
      return;
    }
    const existMap = await this.filePersistenceService.getFileByFilters({ description: floor });
    if (!existMap) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    try {
      await this.filePersistenceService.deleteFile(existMap._id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
      this.logger.error('this.filePersistenceService.updateFile failed');
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  @Put(':floor')
  @UseInterceptors(FileInterceptor('mapFilename'))
  async update(@Param('floor') floor: string, @UploadedFile() file, @Req() req, @Body() body, @Res() res: Response) {
    const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(req.headers.authorization);
    if (userProfile.role !== UserRole.PRINCIPLE) {
      res.sendStatus(HttpStatus.FORBIDDEN).send(NO_PERMISSION);
      return;
    }
    const existMap = await this.filePersistenceService.getFileByFilters({ description: floor });
    if (!existMap) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    const newFile: FileSystemDbModel = {
      content: file,
      description: floor,
      filename: file.originalname,
    };
    delete newFile.content.fieldname;

    try {
      await this.filePersistenceService.updateFile(existMap._id, newFile);
      res.status(HttpStatus.OK).send();
    } catch (err) {
      this.logger.error('this.filePersistenceService.updateFile failed');
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  @Get(':floor')
  async readiness(@Param('floor') floor: string, @Res() res: Response, @Req() req): Promise<void> {
    const userProfile: UserTokenProfile = AuthService.getUserProfileFromToken(req.headers.authorization);
    if (userProfile === null) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }
    const existMap = await this.filePersistenceService.getFileByFilters({ description: floor });
    if (!existMap) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    res.send(existMap).status(HttpStatus.OK);
  }
}
