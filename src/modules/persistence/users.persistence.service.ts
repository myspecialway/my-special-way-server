import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import { UserDbModel, UserRole } from 'models/user.db.model';
import { UserLoginRequest } from 'models/user-login-request.model';
import { IUsersPersistenceService } from './interfaces/users.persistence.service.interface';

@Injectable()
export class UsersPersistenceService extends Logger implements IUsersPersistenceService {
    private _collection: Collection<UserDbModel>;

    constructor(private dbService: DbService) {
        super('UsersPersistenceService');
    }

    private _buildMongoFilterFromQuery(query: { [id: string]: any }, id?: string): { [id: string]: string } {
        if (id) {
            const mongoId = new ObjectID(id);
            query._id = mongoId;
        }
        return query;
    }

    public get collection() {
        if (this._collection) {
            return this._collection;
        }
        const db = this.dbService.getConnection();
        this._collection = db.collection<UserDbModel>('users');
        return this._collection;
    }

    public async getAll(): Promise<UserDbModel[]> {
        try {
            this.log('UsersPersistenceService::getAll:: fetching users');
            return await this.collection.find({}).toArray();
        } catch (error) {
            this.error('UsersPersistenceService::getAll:: error fetching users', error.stack);
            throw error;
        }
    }

    public async getUsersByFilters(queyParams: { [id: string]: string }): Promise<UserDbModel[]> {
        try {
            const mongoQuery = this._buildMongoFilterFromQuery(queyParams);

            this.log(`UsersPersistenceService::getUsersByFilters:: fetching users by parameters `);
            return await this.collection.find(mongoQuery).toArray();
        } catch (error) {
            this.error(`UsersPersistenceService::getUsersByFilters:: error fetching user by parameters`, error.stack);
            throw  error;
        }
    }

    public async getUserByFilters(queyParams: { [id: string]: string }, id?: string ): Promise<UserDbModel> {
        try {
            const mongoQuery = this._buildMongoFilterFromQuery(queyParams, id);

            this.log(`UsersPersistenceService::getUsersByFilters:: fetching users by parameters `);
            return await this.collection.findOne(mongoQuery);
        } catch (error) {
            this.error(`UsersPersistenceService::getUsersByFilters:: error fetching user by parameters`, error.stack);
            throw  error;
        }
    }

    // CRUD on users
    public async getById(id: string): Promise<UserDbModel> {
        try {
            const _id = new ObjectID(id);
            this.log(`UsersPersistenceService::getAll:: fetching user by id ${id}`);
            return await this.collection.findOne({ _id });
        } catch (error) {
            this.error(`UsersPersistenceService::getAll:: error fetching user by id ${id}`, error.stack);
            throw error;
        }
    }

    public async createUser(user: UserDbModel, userRole?: UserRole): Promise<[Error, UserDbModel]> {
        try {
            this.log(`UsersPersistenceService::createUser:: creates user`);
            if (userRole) {
                user.role = userRole;
            }

            const insertResponse = await this.collection.insertOne(user);

            const newDocument = await this.getById(insertResponse.insertedId.toString());
            this.log(`UsersPersistenceService::createUser:: inserted to DB :${JSON.stringify(newDocument)}`);

            return [null, newDocument];
        } catch (error) {
            this.error(`UsersPersistenceService::createUser:: error adding user `, error.stack);
            return [error, null];
        }
    }

    public async updateUser(id: string, user: UserDbModel, userRole?: UserRole): Promise<[Error, UserDbModel]> {
        if (userRole) {
            user.role = userRole;
        }
        const _id = new ObjectID(id);
        try {
            this.log(`UsersPersistenceService::updateUser:: updating user ${_id}`);
            const currentDoc = await this.getById(id);
            const updatedDocument = await this.collection.findOneAndUpdate({ _id }, {...currentDoc, ...user}, { returnOriginal: false});
            this.log(`UsersPersistenceService::updateUser:: updated DB :${JSON.stringify(updatedDocument.value)}`);
            return [null, updatedDocument.value];
        } catch (error) {
            this.error(`UsersPersistenceService::updateUser:: error updating user ${_id}`, error.stack);
            return [error, null];
        }
    }

    public async deleteUser(id: string): Promise<[Error, number]> {
        try {
            const _id = new ObjectID(id);
            this.log(`UsersPersistenceService::deleteUser:: deleting user by id ${id}`);
            const deleteResponse = await this.collection.deleteOne({ _id });
            this.log(`UsersPersistenceService::deleteUser:: removed ${deleteResponse.deletedCount} documents`);
            return [null, deleteResponse.deletedCount];
        } catch (error) {
            this.error(`UsersPersistenceService::deleteUser:: error deleting user by id ${id}`, error.stack);
            return [error, null];
        }
    }

    // Authentication
    // TODO move into a specific service
    public async authenticateUser({ username, password }: UserLoginRequest): Promise<[Error, UserDbModel]> {
        try {
            this.log(`UsersPersistenceService::authenticateUser:: authenticating user ${username}`);
            return [null, await this.collection.findOne({ username, password })];
        } catch (error) {
            this.error(`UsersPersistenceService::authenticateUser:: error authenticating user ${username}`, error.stack);
            return [error, null];
        }
    }

    public async getByUsername(username: string): Promise<[Error, UserDbModel]> {
        try {
            this.log(`UsersPersistenceService::getByUsername:: fetching user by username ${username}`);
            return [null, await this.collection.findOne({ username })];
        } catch (error) {
            this.error(`UsersPersistenceService::getAll:: error fetching user by username ${username}`, error.stack);
            return [error, null];
        }
    }

    // Class
    // TODO move into class service
    public async getStudentsByClassId(class_id: string): Promise<[Error, Array<UserDbModel>]> {
        try {
            this.log(`UsersPersistenceService::getStudentsByClassId:: fetching students by class id ${class_id}`);
            return [null, await this.collection.find({ class_id, role: 'STUDENT' }).toArray()];
        } catch (error) {
            this.error(`UsersPersistenceService::getStudentsByClassId:: error fetching students by class id ${class_id}`, error.stack);
            throw [error, null];
        }
    }
}