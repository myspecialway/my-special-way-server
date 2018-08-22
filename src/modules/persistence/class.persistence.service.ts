import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { SchedulePersistenceService } from './schedule.persistence.service';
import { Collection, ObjectID } from 'mongodb';
import { ClassDbModel } from 'models/class.db.model';

@Injectable()
export class ClassPersistenceService {
    private collection: Collection<ClassDbModel>;
    private logger = new Logger('ClassPersistenceService');
    constructor(private dbService: DbService, private schedulePersistenceService: SchedulePersistenceService) {
        const db = this.dbService.getConnection();
        this.collection = db.collection<ClassDbModel>('classes');
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
            const mongoId = new ObjectID(id);
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
            classObj.schedule = this.schedulePersistenceService.mergeSchedule(currentClass.schedule || [], classObj.schedule);
            const updatedDocument = await this.collection.findOneAndUpdate({ _id: mongoId },
                { ...currentClass, ...classObj }, { returnOriginal: false });
            this.logger.log(`ClassPersistence::updateClass:: updated DB :${JSON.stringify(updatedDocument.value)}`);
            return updatedDocument.value;
        } catch (error) {
            this.logger.error(`ClassPersistence::updateClass:: error updating class ${mongoId}`, error.stack);
            throw error;
        }
    }

    async deleteClass(id: string): Promise<number> {
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
