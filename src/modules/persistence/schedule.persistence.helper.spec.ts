import { TimeSlotDbModel } from '../../models/timeslot.db.model';
import {SchedulePersistenceHelper} from './schedule.persistence.helper';

describe('schedule service', () => {
    const schedulePersistenceHelper: SchedulePersistenceHelper = new SchedulePersistenceHelper();

    it ('should merge 2 timeslots array by unique key index', () => {
        const currentTimeSlots: TimeSlotDbModel[] = [
            {index: '00', lesson: {_id: 'someid', title: 'somelesson', icon: 'someicon'}},
            {index: '01', lesson: {_id: 'someid', title: 'somelesson', icon: 'someicon'}},
        ];
        const newTimelots: TimeSlotDbModel[] = [
            {index: '00', lesson: {_id: 'someid', title: 'updatedlesson', icon: 'updatedicon'}},
            {index: '02', lesson: {_id: 'someid', title: 'somelesson', icon: 'someicon'}},
        ];
        const expected: TimeSlotDbModel[] = [
            {index: '00', lesson: {_id: 'someid', title: 'updatedlesson', icon: 'updatedicon'}},
            {index: '02', lesson: {_id: 'someid', title: 'somelesson', icon: 'someicon'}},
            {index: '01', lesson: {_id: 'someid', title: 'somelesson', icon: 'someicon'}},
        ];
        const result = schedulePersistenceHelper.mergeSchedule(currentTimeSlots, newTimelots, 'index');
        expect(result).toEqual(expected);
    });
});
