import { Injectable } from '@nestjs/common';
import { uniqBy } from 'lodash';
import { TimeSlotDbModel } from '../../models/timeslot.db.model';

@Injectable()
export class SchedulePersistenceService {

    mergeSchedule(current: TimeSlotDbModel[], newCells: TimeSlotDbModel[], key: string): TimeSlotDbModel[] {
        return uniqBy([...newCells, ...current], key);
    }
}