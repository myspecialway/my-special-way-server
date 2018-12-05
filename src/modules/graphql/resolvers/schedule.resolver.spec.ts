import {ScheduleResolver} from './schedule.resolver';
import {SchedulePersistenceService} from '../../persistence/schedule.persistence.service';

describe('schedule resolver', () => {
    let scheduleResolver: ScheduleResolver;
    let schedulePersistence: Partial<SchedulePersistenceService>;

    beforeEach(() => {
        schedulePersistence = {
            deleteScheduleSlotFromClass: jest.fn(),
        };

        scheduleResolver = new ScheduleResolver(schedulePersistence as SchedulePersistenceService);
    });

    it('should call deleteScheduleSlotFromClass function on deleteSchedule', async () => {
        await scheduleResolver.deleteScheduleSlotFromClass(null, {classId: '1', scheduleIndex: '0_1'}, null);
        expect(schedulePersistence.deleteScheduleSlotFromClass).toBeCalledWith('1', '0_1');
    });
});
