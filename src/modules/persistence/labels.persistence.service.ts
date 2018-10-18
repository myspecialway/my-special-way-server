import { LabelDbModel } from 'models/label.db.model';
import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import { LabelType } from 'models/label.db.model';

@Injectable()
export class LabelsPersistenceService {
  private collection: Collection<LabelDbModel>;
  private logger = new Logger('LabelsPersistenceService');
  constructor(private dbService: DbService) {
    const db = this.dbService.getConnection();
    this.collection = db.collection<LabelDbModel>('labels');
  }

  async getAll() {
    try {
      this.logger.log('getAll:: fetching labels');
      return await this.collection
        .find({})
        .toArray();
    } catch (error) {
      this.logger.error('getAll:: error fetching labels', error.stack);
      throw error;
    }
  }
  async getByType(type: LabelType) {
    try {
        this.logger.log(`getByType:: fetching labels by type ${type}`);
        return await this.collection
            .find({ type })
            .sort({ index: 1 })
            .toArray();
    } catch (error) {
      this.logger.error('getByType:: error fetching labels', error.stack);
      throw error;
    }
  }
}
