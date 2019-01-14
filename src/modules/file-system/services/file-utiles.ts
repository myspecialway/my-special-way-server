import { Injectable, BadRequestException } from '@nestjs/common';
import { FileSystemDbModel } from '@models/file-system.db.model';
import { IFileMetaData } from '../model/file';

@Injectable()
export class FileUtilesService {
  scarpFile(mapFile: FileSystemDbModel): any {
    return {
      id: mapFile._id,
      fileName: mapFile.description,
      floor: mapFile.floor,
      mime: mapFile.content.mimetype,
      src: mapFile.content.buffer,
    };
  }
  convertToFile(fileContent: FileSystemDbModel): IFileMetaData {
    const content = fileContent.content;
    return {
      fileData: content.buffer.buffer,
      mime: content.mimetype,
      name: content.originalname,
    } as IFileMetaData;
  }

  validateFiles(file: any) {
    if (!file.originalname || !file.encoding || !file.mimetype || !file.buffer || !file.size) {
      throw new BadRequestException('please upload valid file');
    }
  }

  createNewFile(file: any, floor: number, mapName: string): FileSystemDbModel {
    let newFile: FileSystemDbModel = null;
    newFile = {
      content: file,
      description: mapName,
      filename: file.originalname,
      floor,
    };
    delete newFile.content.fieldname;
    return newFile;
  }
}
