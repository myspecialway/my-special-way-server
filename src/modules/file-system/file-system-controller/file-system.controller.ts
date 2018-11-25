import { Response, Request } from 'express';
import {
  Controller,
  Get,
  Res,
  Post,
  Req,
  Body,
  HttpStatus,
  UseInterceptors,
  FileInterceptor,
  UploadedFile,
} from '@nestjs/common';
import { FileSystemPersistenceService } from '../../persistence/file-system.persistence.service';
import { FileSystemDbModel } from '@models/file-system.db.model';

@Controller()
export class FileSystemController {
  constructor(private filePersistenceService: FileSystemPersistenceService) {}
  @Post('/map')
  @UseInterceptors(FileInterceptor('mapFilename'))
  async upload(@UploadedFile() file, @Req() req, @Body() body) {
    const newFile: FileSystemDbModel = {
      content: file,
      description: body.floor,
      filename: file.originalname,
    };
    delete newFile.content.fieldname;
    await this.filePersistenceService.createFile(newFile);
  }
  @Get('/map/:floor')
  async readiness(@Res() res: Response): Promise<void> {
    res.status(HttpStatus.OK).json({ data: 'success' });
  }
}
