import { Injectable, Logger } from '@nestjs/common';
import { uniqBy } from 'lodash';
import { Collection, ObjectID, Db } from 'mongodb';
import { TimeSlotDbModel } from '../../models/timeslot.db.model';
import { LessonDbModel } from '../../models/lesson.db.model';
import { DbService } from './db.service';
import RoomDbModel from 'models/room.db.model';

@Injectable()
export class SchedulePersistenceService extends Logger {
    private _db: Db;
    constructor(private _dbService: DbService) {
        super('schedule service');
    }

    private get db() {
        if (this._db) {
            return this._db;
        }
        this._db = this._dbService.getConnection();
        return this._db;
    }

    public createNewSchedule(columns: string[], rows: number): TimeSlotDbModel[] {
        const newSchedule: TimeSlotDbModel[] = [];
        columns.forEach(col => {
            for (let i = 1; i <= rows; i++) {
                newSchedule.push({index: `${col}${i}`});
            }
        });
        return newSchedule;
    }

    public mergeSchedule(current: TimeSlotDbModel[], newCells: TimeSlotDbModel[]): TimeSlotDbModel[] {
        return uniqBy([...newCells, ...current], 'index');
    }

    public async getScheduleTimeSlots(schedule) {
        // tslint:disable-next-line:no-console
        console.log(schedule);
        const lessonIds = schedule.map(ts => new ObjectID(ts.lesson_id));
        const lessons = await this.db.collection<LessonDbModel>('lessons').find({_id: {$in: lessonIds}}).toArray();
        // const roomIds = schedule.map((ts: TimeSlotDbModel) => new ObjectID(ts.room_id));
        // const rooms = await this.db.collection<RoomDbmodel>('rooms').find({_id: {$in: roomIds}}).toArray();
        schedule.forEach(timeslot => {
            timeslot.lesson = lessons.find(lesson => lesson._id.toString() === timeslot.lesson_id);
            // timeslot.room = rooms.find(room => room._id === timeslot.room_id);
        });
        return schedule;
    }
}