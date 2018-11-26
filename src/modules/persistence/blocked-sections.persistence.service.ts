import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection } from 'mongodb';
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
}
