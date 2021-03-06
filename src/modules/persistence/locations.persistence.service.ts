import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID, ObjectId } from 'mongodb';
import LocationDbModel from 'models/location.db.model';
import { ILocationsPersistenceService } from './interfaces/locations.persistence.service.interface';
import { BlockedSectionsPersistenceService } from './blocked-sections.persistence.service';

@Injectable()
export class LocationsPersistenceService implements ILocationsPersistenceService {
  private collection: Collection<LocationDbModel>;
  private logger = new Logger('LocationsPersistenceService');

  constructor(
    private dbService: DbService,
    private blockedSectionsPersistenceService: BlockedSectionsPersistenceService,
  ) {
    const db = this.dbService.getConnection();
    this.collection = db.collection<LocationDbModel>('locations');
  }

  async getAll(): Promise<LocationDbModel[]> {
    try {
      this.logger.log('getAll:: fetching locations');
      return await this.collection
        .find({})
        .sort({ name: 1 })
        .toArray();
    } catch (error) {
      this.logger.error('getAll:: error fetching locations', error.stack);
      throw error;
    }
  }

  async getLocationsFromTypeStep(floor: number) {
    try {
      this.logger.log(`getAll:: fetching location by id ${floor}`);
      return await this.collection
        .find({
          $and: [
            { 'position.floor': { $gte: floor - 1 } },
            { 'position.floor': { $lte: floor + 1 } },
            { 'position.floor': { $ne: floor } },
            { type: { $eq: 'מדרגות' } },
          ],
        })
        .sort({ name: 1 })
        .toArray();
    } catch (error) {
      this.logger.error(`getAll:: error location class by id ${floor}`, error.stack);
      throw error;
    }
  }
  async deleteLocationsByImageId(imageId: string) {
    const locations = await this.getByImageId(imageId);
    locations.forEach(async (location) => {
      await this.deleteLocation(location._id.toString());
    });
  }
  async getByImageId(imageId: string) {
    try {
      const mongoId = new ObjectID(imageId);
      this.logger.log(`getByImageId:: fetching location by image id ${imageId}`);
      return await this.collection
        .find({ image_id: mongoId })
        .sort({ name: 1 })
        .toArray();
    } catch (error) {
      this.logger.error(`getAll:: error location class by id ${imageId}`, error.stack);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const mongoId = new ObjectID(id);
      this.logger.log(`getAll:: fetching location by id ${id}`);
      return await this.collection.findOne({ _id: mongoId });
    } catch (error) {
      this.logger.error(`getAll:: error location class by id ${id}`, error.stack);
      throw error;
    }
  }

  async createLocation(location: LocationDbModel): Promise<LocationDbModel> {
    try {
      this.logger.log(`LocationsPersistenceService::createLocation:: create location`);
      location.image_id = new ObjectId(location.image_id);
      const insertResponse = await this.collection.insertOne(location);
      return await this.getById(insertResponse.insertedId.toString());
    } catch (error) {
      this.logger.error('ClassPersistenceService::createClass:: error creating class', error.stack);
      throw error;
    }
  }

  async updateLocation(id: string, locationObj: LocationDbModel): Promise<LocationDbModel> {
    const mongoId = new ObjectID(id);
    locationObj.image_id = new ObjectID(locationObj.image_id);
    try {
      this.logger.log(`LocationPersistence::updateLocation:: updating location ${mongoId}`);
      const updatedDocument = await this.collection.findOneAndUpdate(
        { _id: mongoId },
        { $set: { ...locationObj } },
        { returnOriginal: false },
      );
      this.logger.log(`LocationPersistence::updateLocation:: updated DB :${JSON.stringify(updatedDocument.value)}`);
      return updatedDocument.value;
    } catch (error) {
      this.logger.error(`LocationPersistence::updateLocation:: error updating location ${mongoId}`, error.stack);
      throw error;
    }
  }

  async deleteLocation(id: string): Promise<number> {
    try {
      const mongoId = new ObjectID(id);
      this.logger.log(`LocationPersistence::deleteLocation:: deleting location by id ${id}`);
      await this.blockedSectionsPersistenceService.deleteBlockSectionsByLocation(id);
      const deleteResponse = await this.collection.deleteOne({ _id: mongoId });
      this.logger.log(`LocationPersistence::deleteLocation:: removed ${deleteResponse.deletedCount} documents`);
      return deleteResponse.deletedCount;
    } catch (error) {
      this.logger.error(`LocationPersistence::deleteLocation:: error deleting class by id ${id}`, error.stack);
      throw error;
    }
  }
}
