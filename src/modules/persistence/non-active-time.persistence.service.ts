import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import { NonActiveTimeDbModel } from '@models/non-active-time.db.model';

@Injectable()
export class NonActiveTimePersistenceService {
  private collection: Collection<NonActiveTimeDbModel>;
  private logger = new Logger('NonActiveTimePersistenceService');
  constructor(private dbService: DbService) {
    const db = this.dbService.getConnection();
    this.collection = db.collection<NonActiveTimeDbModel>('nonActiveTimes');
  }

  async getAll() {
    try {
      this.logger.log('getAll:: fetching non-active-times');
      return await this.collection
        .find({})
        .sort({ startDateTime: 1 })
        .toArray();
    } catch (error) {
      this.logger.error('getAll:: error fetching non-active-times', error.stack);
      throw error;
    }
  }

  async createNonActiveTime(newNonActiveTime: NonActiveTimeDbModel): Promise<NonActiveTimeDbModel> {
    try {
      this.logger.log(`NonActiveTimePersistenceService createNonActiveTime`);
      const insertResponse = await this.collection.insertOne(newNonActiveTime);
      const mongoId = new ObjectID(insertResponse.insertedId.toString());
      return await this.collection.findOne({ _id: mongoId });
    } catch (error) {
      this.logger.error(
        'NonActiveTimePersistenceService::createNonActiveTime:: createNonActiveTime creating non-active-time',
        error.stack,
      );
      throw error;
    }
  }

  async updateNonActiveTime(id: string, nonActiveTime: NonActiveTimeDbModel): Promise<NonActiveTimeDbModel> {
    const mongoId = new ObjectID(id);
    try {
      this.logger.log(`NonActiveTimePersistenceService::updateNonActiveTime:: updating non-active-time ${mongoId}`);
      const currentNonActiveTime = await this.collection.findOne({ _id: mongoId });
      const updatedDocument = await this.collection.findOneAndUpdate(
        { _id: mongoId },
        { $set: { ...currentNonActiveTime, ...nonActiveTime } },
        { returnOriginal: false },
      );
      this.logger.log(
        `NonActiveTimePersistenceService::updateNonActiveTime:: updateNonActiveTime DB :${JSON.stringify(
          updatedDocument.value,
        )}`,
      );
      return updatedDocument.value;
    } catch (error) {
      this.logger.error(
        `NonActiveTimePersistenceService::updateNonActiveTime:: error updating non-active-time ${mongoId}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteNonActiveTime(id: string): Promise<number> {
    try {
      const mongoId = new ObjectID(id);
      this.logger.log(`NonActiveTimePersistenceService::deleteNonActiveTime:: deleting non-active-time by id ${id}`);
      const deleteResponse = await this.collection.deleteOne({ _id: mongoId });
      this.logger.log(
        `NonActiveTimePersistenceService::deleteNonActiveTime:: removed ${deleteResponse.deletedCount} documents`,
      );
      return deleteResponse.deletedCount;
    } catch (error) {
      this.logger.error(
        `NonActiveTimePersistenceService::deleteNonActiveTime:: error deleting non-active-time by id ${id}`,
        error.stack,
      );
      throw error;
    }
  }
}
