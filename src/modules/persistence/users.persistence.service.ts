import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import { UserDbModel } from 'models/user.db.model';
import { UserLoginRequest } from 'models/user-login-request.model';
import { IUsersPersistenceService } from './interfaces/Iusers.persistence.service';

@Injectable()
export class UsersPersistenceService extends Logger
  implements IUsersPersistenceService {
  private _collection: Collection<UserDbModel>;

  constructor(private dbService: DbService) {
    super('UsersPersistenceService');
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
      return this.collection.find({}).toArray();
    } catch (error) {
      this.error('UsersPersistenceService::getAll:: error fetching users', error.stack);
      throw error;
    }
  }

  public async getById(id: string): Promise<UserDbModel> {
    try {
      const _dbId = new ObjectID(id);
      this.log(`UsersPersistenceService::getAll:: fetching user by id ${id}`);
      return this.collection.findOne({ _dbId });
    } catch (error) {
      this.error(`UsersPersistenceService::getAll:: error fetching user by id ${id}`, error.stack);
      throw error;
    }
  }

  public async createUser(user: UserDbModel): Promise<UserDbModel> {
    try {
      this.log(`UsersPersistenceService::createUser:: creates user`);
      const insertResponse = await this.collection.insertOne(user);
      const newDocument = await this.getById(insertResponse.insertedId.toHexString());
      this.log(`UsersPersistenceService::createUser:: inserted to DB :${JSON.stringify(newDocument)}`);
      return newDocument;
    } catch (error) {
      this.error(`UsersPersistenceService::createUser:: error adding user `, error.stack);
      throw error;
    }
  }

  public async updateUser(id: string, user: UserDbModel): Promise<UserDbModel> {
    const _dbId = new ObjectID(id);
    try {
      this.log(`UsersPersistenceService::updateUser:: updating user ${_dbId}`);
      await this.collection.replaceOne({ _id: _dbId }, user);
      const updatedDocument = await this.getById(id);
      this.log(`UsersPersistenceService::updateUser:: updated DB :${JSON.stringify(updatedDocument)}`);
      return updatedDocument;
    } catch (error) {
      this.error(
        `UsersPersistenceService::updateUser:: error updating user ${_dbId}`,
        error.stack,
      );
      throw error;
    }
  }

  public async deleteUser(id: string): Promise<number> {
    try {
      const _dbId = new ObjectID(id);
      this.log(`UsersPersistenceService::deleteUser:: deleting user by id ${id}`);
      const deleteResponse = await this.collection.deleteOne({ _id: _dbId });
      this.log(`UsersPersistenceService::deleteUser:: removed ${deleteResponse.deletedCount} documents`);
      return deleteResponse.deletedCount;
    } catch (error) {
      this.error(`UsersPersistenceService::deleteUser:: error deleting user by id ${id}`, error.stack);
      throw error;
    }
  }

  public async authenticateUser({username, password}: UserLoginRequest): Promise<[Error, UserDbModel]> {
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

  public async getClassStudents(class_id: string) {
    try {
        this.log(`getClassStudents: fetching students of class id ${class_id}`);
        return await this.collection.find({ class_id, role: 'STUDENT' }).toArray();
    } catch (error) {
      this.error(`getClassStudents:: error fetching students by class id ${class_id}`, error.stack);
      throw error;
    }
  }
}
