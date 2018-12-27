import { Injectable, Logger } from '@nestjs/common';

import { ObjectID } from 'mongodb';
import { ClassPersistenceService } from './class.persistence.service';
import {ClassDbModel} from '@models/class.db.model';

@Injectable()
export class SchedulePersistenceService {
  private logger = new Logger('SchedulePersistenceService');

  constructor(private classPersistenceService: ClassPersistenceService) {}

  async deleteScheduleSlotFromClass(classId: string, scheduleIndex: string): Promise<ClassDbModel> {
    const mongoId = new ObjectID(classId);
    try {
      this.logger.log(
        `SchedulePersistenceService::deleteScheduleSlotFromClass:: remove from class ${classId} schedule ${scheduleIndex}`,
      );
      const currentClass = await this.classPersistenceService.getById(classId);
      this.filterScheduleFromClass(currentClass, scheduleIndex);
      const updatedDocument = await this.classPersistenceService.updateClassAsIs(mongoId, currentClass);
      this.logger.log(
        `SchedulePersistenceService::deleteScheduleSlotFromClass:: class updated :${JSON.stringify(
          updatedDocument.value,
        )}`,
      );
      return updatedDocument.value;
    } catch (error) {
      this.logger.error(
        `SchedulePersistenceService::deleteScheduleSlotFromClass:: error updating class ${mongoId}`,
        error.stack,
      );
      throw error;
    }
  }

  private filterScheduleFromClass(currentClass, scheduleIndex: string) {
    currentClass.schedule = currentClass.schedule.filter((element) => {
      return element.index !== scheduleIndex;
    });
  }
}
