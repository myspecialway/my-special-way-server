import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import { ClassDbModel } from 'models/class.db.model';

@Injectable()
export class ClassPersistenceService extends Logger {
    private _collection: Collection<ClassDbModel>;
    constructor(private dbService: DbService) {
        super('ClassPersistenceService');
    }

    private get collection() {
        if (this._collection) {
            return this._collection;
        }
        const db = this.dbService.getConnection();
        this._collection = db.collection<ClassDbModel>('classes');
        return this._collection;
    }

    async getAll() {
        try {
            this.log('getAll:: fetching classes');
            return this.collection.find({}).toArray();
        } catch (error) {
            this.error('getAll:: error fetching classes', error.stack);
            throw error;
        }
    }

    async getById(id: string) {
        try {
            const _id = new ObjectID(id);
            this.log(`getAll:: fetching class by id ${id}`);
            return this.collection.findOne({ _id });
        } catch (error) {
            this.error(`getAll:: error fetching class by id ${id}`, error.stack);
            throw error;
        }
    }

    async getByName(name: string) {
        const msg = `getByName:: fetching class by name ${name}`;
        try {
            this.log(msg);
            return this.collection.findOne({ name });
        } catch (error) {
            this.error(msg, error.stack);
            throw error;
        }
    }
}