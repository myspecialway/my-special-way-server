import { Collection } from 'mongodb';
import { FileSystemDbModel } from '@models/file-system.db.model';
import { Logger, Injectable } from '@nestjs/common';
import { DbService } from './db.service';
import { ObjectID } from 'bson';

@Injectable()
export class FileSystemPersistenceService {
  private collection: Collection<FileSystemDbModel>;
  private logger = new Logger('FilePersistenceService');
  constructor(private dbService: DbService) {
    const db = this.dbService.getConnection();
    this.collection = db.collection<FileSystemDbModel>('fileSystem');
  }
  async createFile(newFile: FileSystemDbModel): Promise<boolean> {
    try {
      this.logger.log(`FileSystemPersistenceService createFile`);
      const insertResponse = await this.collection.insertOne(newFile);
      const mongoId = new ObjectID(insertResponse.insertedId.toString());
      return true;
    } catch (error) {
      this.logger.error('FileSystemPersistenceService::createFile:: error create File', error.stack);
      throw error;
    }
  }
}
