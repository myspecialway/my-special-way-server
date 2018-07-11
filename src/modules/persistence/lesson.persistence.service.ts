import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import { LessonDbModel } from 'models/lesson.db.model';

@Injectable()
export class LessonPersistenceService extends Logger {
    private _collection: Collection<LessonDbModel>;
    constructor(private dbService: DbService) {
        super('LessonsPersistenceService');
    }
    public get collection() {
        if (this._collection) {
            return this._collection;
        }
        const db = this.dbService.getConnection();
        this._collection = db.collection<LessonDbModel>('lessons');
        return this._collection;
    }

    async getAll() {
        try {
            this.log('getAll:: fetching lessons');
            return await this.collection.find({}).toArray();
        } catch (error) {
            this.error('getAll:: error fetching lessons', error.stack);
            throw error;
        }
    }

    async createLesson(newLesson: LessonDbModel): Promise<LessonDbModel> {
        try {
            this.log(`LessonsPersistenceService::createLesson:: create class`);
            const insertResponse = await this.collection.insertOne(newLesson);
            const _id = new ObjectID(insertResponse.insertedId.toString());
            return await this.collection.findOne({ _id });
        } catch (error) {
            this.error('LessonsPersistenceService::createLesson:: error creating lesson', error.stack);
            throw error;
        }
    }

    async updateLesson(id: string, lesson: LessonDbModel): Promise<LessonDbModel> {
        const _id = new ObjectID(id);
        try {
            this.log(`LessonsPersistenceService::updateLesson:: updating lesson ${_id}`);
            const currentLesson = await this.collection.findOne({ _id });
            const updatedDocument = await this.collection.findOneAndUpdate({ _id }, {...currentLesson, ...lesson}, {returnOriginal: false});
            this.log(`LessonsPersistenceService::updateLesson:: updated DB :${JSON.stringify(updatedDocument.value)}`);
            return updatedDocument.value;
        } catch (error) {
            this.error(`LessonsPersistenceService::updateLesson:: error updating lesson ${_id}`, error.stack);
            throw error;
        }
    }

    async deleteLesson(id: string): Promise<number> {
        try {
            const _id = new ObjectID(id);
            this.log(`LessonsPersistenceService::deleteLesson:: deleting lesson by id ${id}`);
            const deleteResponse = await this.collection.deleteOne({ _id });
            this.log(`LessonsPersistenceService::deleteLesson:: removed ${deleteResponse.deletedCount} documents`);
            return deleteResponse.deletedCount;
          } catch (error) {
            this.error(`LessonsPersistenceService::deleteLesson:: error deleting lesson by id ${id}`, error.stack);
            throw error;
          }
    }

}