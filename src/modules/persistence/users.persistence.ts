import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import { UserDbModel } from 'models/user.db.model';

@Injectable()
export class UsersPersistenceService extends Logger {
    private _collection: Collection<UserDbModel>;
    constructor(private dbService: DbService) {
        super('UsersPersistenceService');
    }

    get collection() {
        if (this._collection) {
            return this._collection;
        }
        const db = this.dbService.getConnection();
        this._collection = db.collection<UserDbModel>('users');
        return this._collection;
    }

    async getAll() {
        try {
            this.log('getAll:: fetching users');
            return this.collection.find({}).toArray();
        } catch (error) {
            this.error('getAll:: error fetching users', error.stack);
        }
    }

    async getById(id: string) {
        try {
            const _id = new ObjectID(id);
            this.log(`getAll:: fetching user by id ${id}`);
            return this.collection.findOne({ _id });
        } catch (error) {
            this.error(`getAll:: error fetching user by id ${id}`, error.stack);
        }
    }
}