import { Injectable } from '@nestjs/common';
import { TimeSlotDbModel } from '../../../../../models/timeslot.db.model';
import { EducationStage } from '../../../../../models/education-stage.enum';
import * as defaultSchedules from './default-class-schedules';

@Injectable()
export class ClassLogic {
    buildDefaultSchedule(grade: string): [Error | null, TimeSlotDbModel[]] {

        const educationStage = this.calculateEducationStage(grade);
        if (!educationStage) {
            return [new Error('invalid grade received'), []];
        }

        switch (educationStage) {
            case EducationStage.ELEMENTRY:
                return [null, defaultSchedules.ELMENTARY_SCHEDULE];

            case EducationStage.JUNIOR_HIGH:
                return [null, defaultSchedules.JUNIOR_HIGH];
        }
    }

    private calculateEducationStage(grade: string) {
        const VALID_GRADES = /[a-f]/;
        const ELEMENTRY = /[a-c]/;
        const JUNIOR_HIGH = /[d-f]/;

        if (!VALID_GRADES.test(grade)) {
            return null;
        }

        if (ELEMENTRY.test(grade)) {
            return EducationStage.ELEMENTRY;
        }

        if (JUNIOR_HIGH.test(grade)) {
            return EducationStage.JUNIOR_HIGH;
        }
    }
}
