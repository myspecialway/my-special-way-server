import { Injectable } from '@nestjs/common';
import { TimeSlotDbModel } from '../../../../../models/timeslot.db.model';
import { EducationStage } from '../../../../../models/education-stage.enum';
import * as defaultSchedules from './default-class-schedules';
import { LessonDbModel } from '@models/lesson.db.model';

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
  fixLessonIds(lessonsFromDb: LessonDbModel[], schedule: TimeSlotDbModel[]): void {
    schedule.forEach((tss) => {
      if (tss.lesson) {
        const found = lessonsFromDb.find((lessonFromDb) => {
          return lessonFromDb.title === tss.lesson.title;
        });
        if (found) {
          tss.lesson = found;
        }
      }
    });
  }
  private calculateEducationStage(grade: string): EducationStage {
    const ELEMENTRY = /^[a-c]$/;
    const JUNIOR_HIGH = /^[d-f]$/;

    if (ELEMENTRY.test(grade)) {
      return EducationStage.ELEMENTRY;
    }

    if (JUNIOR_HIGH.test(grade)) {
      return EducationStage.JUNIOR_HIGH;
    }

    return null;
  }
}
