import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import BlockedSectionsDbModel from 'models/blocked-sections.db.model';
// TODO: add interface?

@Injectable()
export class BlockedSectionsPersistenceService {
  private collection: Collection<BlockedSectionsDbModel>;
  private logger = new Logger('BlockedSectionsPersistenceService');

  constructor(private dbService: DbService) {
    const db = this.dbService.getConnection();
    this.collection = db.collection<BlockedSectionsDbModel>('blocked_sections');
  }

  async getAll(): Promise<BlockedSectionsDbModel[]> {
    try {
      this.logger.log('getAll:: fetching blocked_sections');
      return await this.collection.find({}).toArray();
    } catch (error) {
      this.logger.error('getAll:: error fetching blocked_sections', error.stack);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const mongoId = new ObjectID(id);
      this.logger.log(`getAll:: fetching blockedSection by id ${id}`);
      return await this.collection.findOne({ _id: mongoId });
    } catch (error) {
      this.logger.error(`getAll:: error blockedSection by id ${id}`, error.stack);
      throw error;
    }
  }
  async createBlockedSection(blockedSection: BlockedSectionsDbModel): Promise<BlockedSectionsDbModel> {
    try {
      this.logger.log(`BlockedSectionsPersistenceService::createBlockedSection:: create blockedSection`);
      const insertResponse = await this.collection.insertOne(blockedSection);
      return await this.getById(insertResponse.insertedId.toString());
    } catch (error) {
      this.logger.error(
        'BlockedSectionsPersistenceService::createBlockedSection:: error creating blockedSection',
        error.stack,
      );
      throw error;
    }
  }

  async deleteBlockedSection(id: string): Promise<number> {
    try {
      const mongoId = new ObjectID(id);
      this.logger.log(`BlockedSectionsPersistenceService::deleteBlockedSection:: deleting blockedSection by id ${id}`);
      const deleteResponse = await this.collection.deleteOne({ _id: mongoId });
      this.logger.log(
        `BlockedSectionsPersistenceService::deleteBlockedSection:: removed ${deleteResponse.deletedCount} documents`,
      );
      return deleteResponse.deletedCount;
    } catch (error) {
      this.logger.error(
        `BlockedSectionsPersistenceService::deleteBlockedSection:: error deleting blockedSection by id ${id}`,
        error.stack,
      );
      throw error;
    }
  }
}
