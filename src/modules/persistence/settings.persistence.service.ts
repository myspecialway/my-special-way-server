import { Injectable, Logger } from '@nestjs/common';
import { ISettingsPersistenceService } from './interfaces/settings.persistence.service.interface';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import SettingsDbModel from '@models/settings.db.model';

@Injectable()
export class SettingsPersistenceService implements ISettingsPersistenceService {
  private collection: Collection<SettingsDbModel>;
  private logger = new Logger('SettingsPersistenceService');

  constructor(private dbService: DbService) {
    const db = this.dbService.getConnection();
    this.collection = db.collection<SettingsDbModel>('settings');
  }
  async getAll(): Promise<SettingsDbModel[]> {
    try {
      this.logger.log('SettingsPersistenceService::getAllSettings:: fetching settings');
      return await this.collection.find().toArray();
    } catch (error) {
      this.logger.error('SettingsPersistenceService::getAllSettings:: error fetching settings', error.stack);
      throw error;
    }
  }

  async updateSettings(id: string, settingsObj: SettingsDbModel): Promise<[Error, SettingsDbModel]> {
    const mongoId = new ObjectID(id);
    try {
      this.logger.log(`SettingsPersistenceService::updateSettings:: updating settings ${mongoId}`);
      const updatedDocument = await this.collection.findOneAndUpdate(
        { _id: mongoId },
        { $set: { ...settingsObj } },
        { returnOriginal: false },
      );
      this.logger.log(
        `SettingsPersistenceService::updateSettings:: updated DB :${JSON.stringify(updatedDocument.value)}`,
      );
      return [null, updatedDocument.value];
    } catch (error) {
      this.logger.error(`SettingsPersistenceService::updateSettings:: error updating settings ${mongoId}`, error.stack);
      return [error, null];
    }
  }
}
