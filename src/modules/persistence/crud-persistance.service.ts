import { Collection, ObjectID } from 'mongodb';
import { DbService } from './db.service';
import { Logger } from '@nestjs/common';

export abstract class CRUDPersistance<T> {
    protected collection: Collection<T>;
    protected logger: Logger;

    constructor(private collectionName: string, private dbService: DbService) {
        const db = this.dbService.getConnection();
        this.collection = db.collection<T>(collectionName);
        this.logger = new Logger(`${collectionName}_PersistenceService`);
    }

    async getAll() {
        try {
            this.logger.log(`getAll:: fetching ${this.collectionName}`);
            return await this.collection.find({}).toArray();
        } catch (error) {
            this.logger.error(`getAll:: error fetching ${this.collectionName}`, error.stack);
            throw error;
        }
    }

    async getById(id: string) {
        try {
            const mongoId = new ObjectID(id);
            this.logger.log(`getAll:: fetching document by id ${id} from ${this.collectionName}`);
            return await this.collection.findOne({ _id: mongoId });
        } catch (error) {
            this.logger.error(`getAll:: error fetching document by id ${id} from ${this.collectionName}`, error.stack);
            throw error;
        }
    }

    async create(newDocument: T): Promise<T> {
        try {
            this.logger.log(`create:: creating new document in ${this.collectionName}`);
            const insertResponse = await this.collection.insertOne(newDocument);
            return await this.getById(insertResponse.insertedId.toString());
        } catch (error) {
            this.logger.error(`create:: error creating new document in ${this.collectionName}`, error.stack);
            throw error;
        }
    }
}
