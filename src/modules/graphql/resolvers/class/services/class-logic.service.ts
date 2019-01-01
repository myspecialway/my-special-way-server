import { Injectable } from '@nestjs/common';
import { TimeSlotDbModel } from '../../../../../models/timeslot.db.model';
import { EducationStage } from '../../../../../models/education-stage.enum';
import * as defaultSchedules from './default-class-schedules';
import { LessonDbModel } from '@models/lesson.db.model';
import { ClassDbModel } from '@models/class.db.model';
import { OriginalDbData } from '@models/original.db.mode';
import * as moment from 'moment';

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
      const isExpired = this.isTemporeryClassTimeExpired(original);
      return !isExpired;
    });
    return filterSchedulerWithoutExpiredV;
  }

  filterSchedulerByExpired(schedule: TimeSlotDbModel[]) {
    let filterSchedulerByExpiredV = schedule.filter((scheduleItem) => {
      const original = scheduleItem.original;
      const isExpired = this.isTemporeryClassTimeExpired(original);
      return isExpired ? true : false;
    });

    filterSchedulerByExpiredV = filterSchedulerByExpiredV.map((scheduleItem) => {
      scheduleItem.lesson = scheduleItem.original.lesson;
      scheduleItem.location = scheduleItem.original.location;
      scheduleItem.original = undefined;
      return scheduleItem;
    });
    return filterSchedulerByExpiredV;
  }

  private isTemporeryClassTimeExpired(original?: OriginalDbData) {
    if (original) {
      if (
        moment()
          .utc()
          .isAfter(original.expired)
      ) {
        return true;
      }
    }
    return false;
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
