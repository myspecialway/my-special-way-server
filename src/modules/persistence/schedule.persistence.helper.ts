import { Injectable} from '@nestjs/common';

import { TimeSlotDbModel } from '../../models/timeslot.db.model';
import { uniqBy } from 'lodash';

@Injectable()
export class SchedulePersistenceHelper {

    mergeSchedule(current: TimeSlotDbModel[], newCells: TimeSlotDbModel[], key: string): TimeSlotDbModel[] {
        return uniqBy([...newCells, ...current], key);
    }

}
