import { Module } from '@nestjs/common';
import { getDbServiceProvider } from './db.service';
import { ClassPersistenceService } from './class.persistence.service';
import { UsersPersistenceService } from './users.persistence.service';
import { LessonPersistenceService } from './lesson.persistence.service';
import { LocationsPersistenceService } from './locations.persistence.service';
import { getConfig } from '../../config/config-loader';
import { StudentPermissionService } from '../permissions/student.premission.service';
import { SchedulePersistenceHelper } from './schedule.persistence.helper';
import { SchedulePersistenceService } from './schedule.persistence.service';
import { NonActiveTimePersistenceService } from './non-active-time.persistence.service';

@Module({
  providers: [
    getDbServiceProvider(getConfig().DB_CONNECTION_STRING, getConfig().DB_NAME),
    UsersPersistenceService,
    ClassPersistenceService,
    LessonPersistenceService,
    SchedulePersistenceHelper,
    SchedulePersistenceService,
    LocationsPersistenceService,
    StudentPermissionService,
    NonActiveTimePersistenceService,
  ],
  exports: [
    UsersPersistenceService,
    ClassPersistenceService,
    LessonPersistenceService,
    SchedulePersistenceHelper,
    SchedulePersistenceService,
    LocationsPersistenceService,
    StudentPermissionService,
    NonActiveTimePersistenceService,
  ],
})
export class PersistenceModule {}
