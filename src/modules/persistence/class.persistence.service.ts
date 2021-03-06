import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID, Db } from 'mongodb';
import { ClassDbModel } from 'models/class.db.model';
import { SchedulePersistenceHelper } from './schedule.persistence.helper';
import { UserDbModel } from '@models/user.db.model';

@Injectable()
export class ClassPersistenceService {
  private collection: Collection<ClassDbModel>;
  private logger = new Logger('ClassPersistenceService');
  private db: Db;
  constructor(private dbService: DbService, private schedulePersistenceHelper: SchedulePersistenceHelper) {
    this.db = this.dbService.getConnection();
    this.collection = this.db.collection<ClassDbModel>('classes');
    this.createIndex();
  }

  async createIndex() {
    this.collection.createIndex({ name: 1 }, { unique: true });
  }

  async getAll() {
    try {
      this.logger.log('getAll:: fetching classes');
      return await this.collection.find({}).toArray();
    } catch (error) {
      this.logger.error('getAll:: error fetching classes', error.stack);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const mongoId = ObjectID.isValid(id) ? new ObjectID(id) : id;
      this.logger.log(`getAll:: fetching class by id ${id}`);
      return await this.collection.findOne({ _id: mongoId });
    } catch (error) {
      this.logger.error(`getAll:: error fetching class by id ${id}`, error.stack);
      throw error;
    }
  }

  async getByName(name: string) {
    const msg = `getByName:: fetching class by name ${name}`;
    try {
      this.logger.log(msg);
      return await this.collection.findOne({ name });
    } catch (error) {
      this.logger.error(msg, error.stack);
      throw error;
    }
  }

  async createClass(newClass: ClassDbModel): Promise<ClassDbModel> {
    try {
      this.logger.log(`ClassPersistenceService::createClass:: create class`);
      if ((await this.getByName(newClass.name)) !== null) {
        throw new Error('Class already exists');
      }
      const insertResponse = await this.collection.insertOne(newClass);
      return await this.getById(insertResponse.insertedId.toString());
    } catch (error) {
      this.logger.error('ClassPersistenceService::createClass:: error creating class', error.stack);
      throw error;
    }
  }

  async updateClass(id: string, classObj: ClassDbModel): Promise<ClassDbModel> {
    const mongoId = new ObjectID(id);
    try {
      this.logger.log(`ClassPersistence::updateClass:: updating class ${mongoId}`);
      const currentClass = await this.getById(id);
      classObj.schedule = this.schedulePersistenceHelper.mergeSchedule(
        currentClass.schedule || [],
        classObj.schedule,
        'index',
      );
      const updatedDocument = await this.updateClassAsIs(mongoId, classObj);
      this.logger.log(`ClassPersistence::updateClass:: updated DB :${JSON.stringify(updatedDocument.value)}`);
      return updatedDocument.value;
    } catch (error) {
      this.logger.error(`ClassPersistence::updateClass:: error updating class ${mongoId}`, error.stack);
      throw error;
    }
  }

  async updateClassAsIs(mongoId, classObj: ClassDbModel) {
    return await this.collection.findOneAndUpdate(
      { _id: mongoId },
      { $set: { ...classObj } },
      { returnOriginal: false },
    );
  }

  async deleteClass(id: string): Promise<number> {
    try {
      const studentCollection = this.db.collection<UserDbModel>('users');
      this.logger.log(`ClassPersistence::deleteClass:: fetching students by class id ${id}`);
      const res = await studentCollection.find({ class_id: new ObjectID(id), role: 'STUDENT' }).toArray();
      if (res.length > 0) {
        this.logger.log(`ClassPersistence::deleteClass::  not deleting ${id}; it is not empty`);
        return 0;
      }
    } catch (error) {
      this.logger.error(`ClassPersistence::deleteClass:: error fetching students by class id ${id}`, error.stack);
      throw [error, null];
    }
    try {
      const mongoId = new ObjectID(id);
      this.logger.log(`ClassPersistence::deleteClass:: deleting class by id ${id}`);
      const deleteResponse = await this.collection.deleteOne({ _id: mongoId });
      this.logger.log(`ClassPersistence::deleteClass:: removed ${deleteResponse.deletedCount} documents`);
      return deleteResponse.deletedCount;
    } catch (error) {
      this.logger.error(`ClassPersistence::deleteClass:: error deleting class by id ${id}`, error.stack);
      throw error;
    }
  }
}
