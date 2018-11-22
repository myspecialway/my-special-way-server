import { Injectable, Logger } from '@nestjs/common';
import { uniqBy } from 'lodash';
import { TimeSlotDbModel } from '../../models/timeslot.db.model';
import LocationDbModel from '@models/location.db.model';
import { Collection } from 'mongodb';
import { DbService } from './db.service';

@Injectable()
export class SchedulePersistenceService {
    private collection: Collection<LocationDbModel>;
    private logger = new Logger('LocationsPersistenceService');

    constructor(private dbService: DbService) {
        const db = this.dbService.getConnection();
        this.collection = db.collection<LocationDbModel>('classes');
    }

    mergeSchedule(current: TimeSlotDbModel[], newCells: TimeSlotDbModel[], key: string): TimeSlotDbModel[] {
        return uniqBy([...newCells, ...current], key);
    }

    async deleteScheduleSlotFromClass(classId: string, scheduleIndex: string): Promise<number> {
       // this.collection.findOneAndUpdate()
        return 0;
    }
}
