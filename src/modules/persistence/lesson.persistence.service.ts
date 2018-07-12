import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import { LessonDbModel } from 'models/lesson.db.model';

@Injectable()
export class LessonPersistenceService {
    private collection: Collection<LessonDbModel>;
    private logger = new Logger('LessonPersistenceService');
    constructor(private dbService: DbService) {
        const db = this.dbService.getConnection();
        this.collection = db.collection<LessonDbModel>('lessons');
    }

    async getAll() {
        try {
            this.logger.log('getAll:: fetching lessons');
            return await this.collection.find({}).toArray();
        } catch (error) {
            this.logger.error('getAll:: error fetching lessons', error.stack);
            throw error;
        }
    }

    async createLesson(newLesson: LessonDbModel): Promise<LessonDbModel> {
        try {
            this.logger.log(`LessonsPersistenceService::createLesson:: create class`);
            const insertResponse = await this.collection.insertOne(newLesson);
            const mongoId = new ObjectID(insertResponse.insertedId.toString());
            return await this.collection.findOne({ _id: mongoId });
        } catch (error) {
            this.logger.error('LessonsPersistenceService::createLesson:: error creating lesson', error.stack);
            throw error;
        }
    }

    async updateLesson(id: string, lesson: LessonDbModel): Promise<LessonDbModel> {
        const mongoId = new ObjectID(id);
        try {
            this.logger.log(`LessonsPersistenceService::updateLesson:: updating lesson ${mongoId}`);
            const currentLesson = await this.collection.findOne({ _id: mongoId });
            const updatedDocument = await this.collection.findOneAndUpdate(
                { _id: mongoId },
                { ...currentLesson, ...lesson },
                { returnOriginal: false },
            );
            this.logger.log(`LessonsPersistenceService::updateLesson:: updated DB :${JSON.stringify(updatedDocument.value)}`);
            return updatedDocument.value;
        } catch (error) {
            this.logger.error(`LessonsPersistenceService::updateLesson:: error updating lesson ${mongoId}`, error.stack);
            throw error;
        }
    }

    async deleteLesson(id: string): Promise<number> {
        try {
            const mongoId = new ObjectID(id);
            this.logger.log(`LessonsPersistenceService::deleteLesson:: deleting lesson by id ${id}`);
            const deleteResponse = await this.collection.deleteOne({ _id: mongoId });
            this.logger.log(`LessonsPersistenceService::deleteLesson:: removed ${deleteResponse.deletedCount} documents`);
            return deleteResponse.deletedCount;
        } catch (error) {
            this.logger.error(`LessonsPersistenceService::deleteLesson:: error deleting lesson by id ${id}`, error.stack);
            throw error;
        }
    }

}
