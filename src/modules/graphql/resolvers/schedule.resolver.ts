import { Resolver, Mutation } from '@nestjs/graphql';
import { SchedulePersistenceService } from 'modules/persistence/schedule.persistence.service';

@Resolver('Schedule')
export class ScheduleResolver {
    constructor(private schedulePersistance: SchedulePersistenceService) { }

    @Mutation('deleteScheduleSlotFromClass')
    async deleteScheduleSlotFromClass(_, { classId, scheduleIndex }, context) {
        return this.schedulePersistance.deleteScheduleSlotFromClass(classId, scheduleIndex);
    }
}