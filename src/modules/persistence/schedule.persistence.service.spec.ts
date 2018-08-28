import { TimeSlotDbModel } from '../../models/timeslot.db.model';
import { SchedulePersistenceService } from './schedule.persistence.service';

describe('schedule service', () => {
    const schedulePersistenceService: SchedulePersistenceService = new SchedulePersistenceService();

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
        const result = schedulePersistenceService.mergeSchedule(currentTimeSlots, newTimelots, 'index');
        expect(result).toEqual(expected);
    });
});
