import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection } from 'mongodb';
import LocationDbModel from 'models/location.db.model';
import { ILocationsPersistenceService } from './interfaces/locations.persistence.service.interface';

@Injectable()
export class LocationsPersistenceService implements ILocationsPersistenceService {
    private collection: Collection<LocationDbModel>;
    private logger = new Logger('LocationsPersistenceService');

    constructor(private dbService: DbService) {
        const db = this.dbService.getConnection();
        this.collection = db.collection<LocationDbModel>('locations');
    }

    async getAll(): Promise<LocationDbModel[]> {
        try {
            this.logger.log('getAll:: fetching locations');
            return await this.collection.find({}).sort({ name: 1 }).toArray();
        } catch (error) {
            this.logger.error('getAll:: error fetching locations', error.stack);
            throw error;
        }
    }
}
