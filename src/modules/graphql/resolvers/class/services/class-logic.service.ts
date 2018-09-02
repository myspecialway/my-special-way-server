import { Injectable } from '@nestjs/common';
import { TimeSlotDbModel } from '../../../../../models/timeslot.db.model';
import { EducationStage } from '../../../../../models/education-stage.enum';
import * as defaultSchedules from './default-class-schedules';

@Injectable()
export class ClassLogic {
    buildDefaultSchedule(educationStage: EducationStage): TimeSlotDbModel[] {
        switch (educationStage) {
            case EducationStage.ELEMENTRY:
                return defaultSchedules.ELMENTARY_SCHEDULE;

            case EducationStage.JUNIOR_HIGH:
                return defaultSchedules.JUNIOR_HIGH;
        }
    }
}
