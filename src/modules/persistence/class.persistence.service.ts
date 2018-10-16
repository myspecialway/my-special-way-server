import { Injectable } from '@nestjs/common';
import { DbService } from './db.service';
import { SchedulePersistenceService } from './schedule.persistence.service';
import { ObjectID } from 'mongodb';
import { ClassDbModel } from 'models/class.db.model';
import { CRUDPersistance } from './crud-persistance.service';

@Injectable()
export class ClassPersistenceService extends CRUDPersistance<ClassDbModel> {
    constructor(dbService: DbService, private schedulePersistenceService: SchedulePersistenceService) {
        super('classes', dbService);
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

    async updateClass(id: string, classObj: ClassDbModel): Promise<ClassDbModel> {
        const mongoId = new ObjectID(id);
        try {
            this.logger.log(`ClassPersistence::updateClass:: updating class ${mongoId}`);
            const currentClass = await this.getById(id);
            classObj.schedule = this.schedulePersistenceService.mergeSchedule(currentClass.schedule || [], classObj.schedule, 'index');
            const updatedDocument = await this.collection.findOneAndUpdate({ _id: mongoId },
                { $set: {...classObj} }, { returnOriginal: false });
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
