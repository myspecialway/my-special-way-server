import { Collection, Cursor, ObjectID, FindOneOptions } from 'mongodb';
import { FileSystemDbModel } from '@models/file-system.db.model';
import {
  Logger,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DbService } from './db.service';

@Injectable()
export class FileSystemPersistenceService {
  private collection: Collection<FileSystemDbModel>;
  private logger = new Logger('FilePersistenceService');
  constructor(private dbService: DbService) {
    const db = this.dbService.getConnection();
    this.collection = db.collection<FileSystemDbModel>('fileSystem');
  }

  async createFile(newFile: FileSystemDbModel): Promise<any> {
    try {
      this.logger.log(`FileSystemPersistenceService createFile`);
      const uploadedFile = await this.collection.insertOne(newFile);
      if (uploadedFile) {
        return uploadedFile.insertedId.toString();
      }
      return null;
    } catch (error) {
      this.logger.error('FileSystemPersistenceService::createFile:: error create File', error.stack);
      throw new InternalServerErrorException('can not insert file to db');
    }
  }

  async isFileExist(queyParams: { [id: string]: string | number | ObjectID }) {
    const item = await this.collection.findOne(queyParams);
    if (item) {
      throw new BadRequestException('item is exist');
    }
    return;
  }

  async getFileByFilters(
    queyParams: { [id: string]: string | number | ObjectID },
    // tslint:disable-next-line:align
    projection?: { [id: string]: number },
  ): Promise<FileSystemDbModel> {
    try {
      let option: FindOneOptions;
      this.logger.log(`getFileByFilters:: fetching file by parameters `);
      if (projection) {
        option = { projection };
      }
      const item = await this.collection.findOne(queyParams, option);
      if (!item) {
        throw new NotFoundException('item is not found');
      }
      return item;
    } catch (error) {
      this.logger.error(`getFileByFilters:: error fetching user by parameters`, error.stack);
      throw new InternalServerErrorException('can not filter file');
    }
  }

  async deleteFile(id: string): Promise<void> {
    try {
      this.logger.log(`FileSystemPersistenceService deleteFile`);
      await this.collection.deleteOne({ _id: id });
    } catch (error) {
      this.logger.error('FileSystemPersistenceService::deleteFile:: error delete File', error.stack);
      throw new InternalServerErrorException('can not delete file');
    }
  }

  async filterOnlyIdsFromFSObject(): Promise<any> {
    this.logger.log(`FileSystemPersistenceService getAllNames`);
    const curser = await this.collection.find({}, { projection: { _id: 1 } });
    return await this.scarpIdsFromDbObjects(curser);
  }

  async collectIDs(): Promise<any> {
    try {
      this.logger.log(`FileSystemPersistenceService getAllNames`);
      return await this.filterOnlyIdsFromFSObject();
    } catch (error) {
      this.logger.error('FileSystemPersistenceService::deleteFile:: error delete File', error.stack);
      throw new InternalServerErrorException('can not insert file to db');
    }
  }

  private async scarpIdsFromDbObjects(cursor: Cursor<any>) {
    const resultIds = [];
    const objectDbList = await cursor.toArray();
    objectDbList.forEach((item) => {
      resultIds.push(item._id.toString());
    });
    return resultIds;
  }
}
