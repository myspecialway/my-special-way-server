import * as Joi from 'joi';
import {
  Body,
  Controller,
  Delete,
  FileInterceptor,
  Get,
  Logger,
  Param,
  Post,
  UsePipes,
  Res,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
import { FileSystemPersistenceService } from '../../persistence/file-system.persistence.service';
import { JoiValidationPipe } from '../pipe/validation-pipe';
import { ObjectID } from 'mongodb';
import { FileUtilesService } from '../services/file-utiles';
import { AuthFileGuard } from '../guard/guard-file-system';

const uploadschema = Joi.object().keys({
  floor: Joi.number()
    .min(-100)
    .max(100)
    .required(),
  mapName: Joi.required(),
});

@Controller('/map')
@UseGuards(new AuthFileGuard())
export class FileSystemController {
  private logger = new Logger('FileSystemController');
  constructor(
    private readonly filePersistenceService: FileSystemPersistenceService,
    private readonly fileUtilesService: FileUtilesService,
  ) {}
  @Post()
  @UseInterceptors(FileInterceptor('mapFilename'))
  @UsePipes(new JoiValidationPipe(uploadschema))
  async upload(@UploadedFile() file, @Body() body, @Res() res: Response) {
    try {
      await this.filePersistenceService.isFileExist({ description: body.mapName, floor: body.floor });
      this.fileUtilesService.validateFiles(file);
      const id = await this.filePersistenceService.createFile(
        this.fileUtilesService.createNewFile(file, body.floor, body.mapName),
      );
      return res.status(HttpStatus.CREATED).json({ status: 'created', id });
    } catch (error) {
      this.errorHandle(error, res, 'upload Map');
    }
  }

  @Delete(':id')
  async deleteMap(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.filePersistenceService.deleteAllChildernOfMap(id);
      const mapObject = await this.filePersistenceService.getFileByFilters({ _id: new ObjectID(id) });
      await this.filePersistenceService.deleteFile(mapObject._id);
      return res.status(HttpStatus.NO_CONTENT).end(null);
    } catch (error) {
      this.errorHandle(error, res, 'delete map by Id');
    }
  }

  @Get()
  async getAllFillesIds(@Res() res) {
    try {
      return res.json(await this.filePersistenceService.collectIDs());
    } catch (error) {
      return this.errorHandle(error, res, 'get id lists');
    }
  }

  @Get(':id')
  async getMap(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      const map = await this.filePersistenceService.getFileByFilters(
        { _id: new ObjectID(id) },
        { description: 1, filename: 1, floor: 1, _id: 0, content: 1 },
      );
      res.status(200).send(this.fileUtilesService.scarpFile(map, id));
    } catch (error) {
      return this.errorHandle(error, res, 'download one map');
    }
  }

  private errorHandle(error: any, res: Response, sourceFunction: string) {
    this.logger.error(`this.filePersistenceService.${sourceFunction} failed`);
    if (error instanceof NotFoundException) {
      return res.status(HttpStatus.NOT_FOUND).end(null);
    }
    if (error instanceof BadRequestException) {
      return res.status(HttpStatus.BAD_REQUEST).end(null);
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).end(null);
  }
}
