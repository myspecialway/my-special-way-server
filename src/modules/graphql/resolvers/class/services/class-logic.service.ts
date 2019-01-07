import { Injectable } from '@nestjs/common';
import { TimeSlotDbModel } from '../../../../../models/timeslot.db.model';
import { EducationStage } from '../../../../../models/education-stage.enum';
import * as defaultSchedules from './default-class-schedules';
import { LessonDbModel } from '@models/lesson.db.model';
import { DateUtilesService } from '../../utiles/services/date-service';

@Injectable()
export class ClassLogic {
  constructor(private dateUtilesService: DateUtilesService) {}
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

  mergeSchedulerClass(schedule: TimeSlotDbModel[]) {
    const res = {
      isUpdate: false,
      schedule: [],
    };

    if (schedule) {
      let onlyExpierd = this.filterSchedulerByExpired(schedule);
      if (onlyExpierd.length) {
        onlyExpierd = this.filterExpiredItemWithoutParentState(onlyExpierd);
        const withoutExpierd = this.filterSchedulerWithoutExpired(schedule);
        res.schedule = onlyExpierd.concat(withoutExpierd);
        res.isUpdate = true;
      }
    }
    return res;
  }

  private filterExpiredItemWithoutParentState(onlyExpierd: TimeSlotDbModel[]) {
    onlyExpierd = onlyExpierd.filter((expiredItem) => {
      return !expiredItem.location || !expiredItem.lesson ? false : true;
    });
    return onlyExpierd;
  }

  filterSchedulerWithoutExpired(schedule: TimeSlotDbModel[]) {
    const filterSchedulerWithoutExpiredV = schedule.filter((scheduleItem) => {
      const original = scheduleItem.original;
      if (!original) {
        return true;
      }
      const isExpired = this.dateUtilesService.isExpired(original.expired);
      return isExpired ? false : true;
    });
    return filterSchedulerWithoutExpiredV;
  }

  filterSchedulerByExpired(schedule: TimeSlotDbModel[]) {
    let filterSchedulerByExpiredV = schedule.filter((scheduleItem) => {
      const original = scheduleItem.original;
      if (!original) {
        return false;
      }
      const isExpired = this.dateUtilesService.isExpired(original.expired);
      return isExpired ? true : false;
    });

    filterSchedulerByExpiredV = filterSchedulerByExpiredV.map((scheduleItem) => {
      const obj = {
        lesson: scheduleItem.original.lesson,
        location: scheduleItem.original.location,
        original: undefined,
      };
      return Object.assign({}, scheduleItem, obj);
    });
    return filterSchedulerByExpiredV;
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
