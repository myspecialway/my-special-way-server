import { Resolver, Mutation } from '@nestjs/graphql';
import {SchedulePersistenceService} from '../../persistence/schedule.persistence.service';

@Resolver('Schedule')
export class ScheduleResolver {
    constructor(private persistenceService: SchedulePersistenceService) { }

    @Mutation('deleteScheduleSlotFromClass')
    async deleteScheduleSlotFromClass(_, { classId, scheduleIndex }, context) {
        return this.persistenceService.deleteScheduleSlotFromClass(classId, scheduleIndex);
    }
}
