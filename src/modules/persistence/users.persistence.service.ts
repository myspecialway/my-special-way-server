import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import { UserDbModel } from 'models/user.db.model';
import { UserLoginRequest } from 'models/user-login-request.model';

@Injectable()
export class UsersPersistenceService extends Logger {
    private _collection: Collection<UserDbModel>;
    constructor(private dbService: DbService) {
        super('UsersPersistenceService');
    }

    private get collection() {
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
            throw error;
        }
    }

    async getById(id: string) {
        try {
            const _id = new ObjectID(id);
            this.log(`getAll:: fetching user by id ${id}`);
            return this.collection.findOne({ _id });
        } catch (error) {
            this.error(`getAll:: error fetching user by id ${id}`, error.stack);
            throw error;
        }
    }

    async authenticateUser({ username, password }: UserLoginRequest): Promise<[Error, UserDbModel]> {
        try {
            this.log(`authenticateUser:: authenticating user ${username}`);
            return [null, await this.collection.findOne({ username, password })];
        } catch (error) {
            this.error(`authenticateUser:: error authenticating user ${username}`, error.stack);
            return [error, null];
        }
    }

    async getByUsername(username: string): Promise<[Error, UserDbModel]> {
        try {
            this.log(`getByUsername:: fetching user by username ${username}`);
            return [null, await this.collection.findOne({ username })];
        } catch (error) {
            this.error(`getAll:: error fetching user by username ${username}`, error.stack);
            return [error, null];
        }
    }
}