import { Collection } from 'mongodb';
import { FileSystemDbModel } from '@models/file-system.db.model';
import { Logger, Injectable } from '@nestjs/common';
import { DbService } from './db.service';

@Injectable()
export class FileSystemPersistenceService {
  private collection: Collection<FileSystemDbModel>;
  private logger = new Logger('FilePersistenceService');
  constructor(private dbService: DbService) {
    const db = this.dbService.getConnection();
    this.collection = db.collection<FileSystemDbModel>('fileSystem');
  }
  private buildMongoFilterFromQuery(query: { [id: string]: any }, id?: string): { [id: string]: string } {
    // if (id) {
    //   const mongoId = new ObjectID(id);
    //   query._id = mongoId;
    // }
    return query;
  }
  async createFile(newFile: FileSystemDbModel): Promise<void> {
    try {
      this.logger.log(`FileSystemPersistenceService createFile`);
      await this.collection.insertOne(newFile);
    } catch (error) {
      this.logger.error('FileSystemPersistenceService::createFile:: error create File', error.stack);
      throw error;
    }
  }
  async getFileByFilters(queyParams: { [id: string]: string }, id?: string): Promise<FileSystemDbModel> {
    try {
      const mongoQuery = this.buildMongoFilterFromQuery(queyParams, id);
      this.logger.log(`getFileByFilters:: fetching file by parameters `);
      return await this.collection.findOne(mongoQuery);
    } catch (error) {
      this.logger.error(`getFileByFilters:: error fetching user by parameters`, error.stack);
      throw error;
    }
  }
  async updateFile(id: string, newFile: FileSystemDbModel): Promise<void> {
    try {
      this.logger.log(`FileSystemPersistenceService updateFile`);
      await this.collection.findOneAndReplace({ _id: id }, newFile);
    } catch (error) {
      this.logger.error('FileSystemPersistenceService::updateFile:: error update File', error.stack);
      throw error;
    }
  }
  async deleteFile(id: string): Promise<void> {
    try {
      this.logger.log(`FileSystemPersistenceService deleteFile`);
      await this.collection.deleteOne({ _id: id });
    } catch (error) {
      this.logger.error('FileSystemPersistenceService::deleteFile:: error delete File', error.stack);
      throw error;
    }
  }
}
