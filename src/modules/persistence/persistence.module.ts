import { Module } from '@nestjs/common';
import { getDbServiceProvider } from './db.service';
import { ClassPersistenceService } from './class.persistence.service';
import { UsersPersistenceService } from './users.persistence.service';
import { LessonPersistenceService } from './lesson.persistence.service';
import { LocationsPersistenceService } from './locations.persistence.service';
import { getConfig } from '../../config/config-loader';
import { StudentPermissionService } from '../permissions/student.premission.service';
import { FileSystemPersistenceService } from './file-system.persistence.service';
import { SchedulePersistenceHelper } from './schedule.persistence.helper';
import { SettingsPersistenceService } from './settings.persistence.service';
import { SchedulePersistenceService } from './schedule.persistence.service';

@Module({
  providers: [
    getDbServiceProvider(getConfig().DB_CONNECTION_STRING, getConfig().DB_NAME),
    UsersPersistenceService,
    ClassPersistenceService,
    LessonPersistenceService,
    FileSystemPersistenceService,
    SchedulePersistenceHelper,
    SchedulePersistenceService,
    LocationsPersistenceService,
    StudentPermissionService,
    SettingsPersistenceService,
  ],
  exports: [
    UsersPersistenceService,
    ClassPersistenceService,
    LessonPersistenceService,
    LocationsPersistenceService,
    FileSystemPersistenceService,
    SchedulePersistenceHelper,
    SchedulePersistenceService,
    StudentPermissionService,
    SettingsPersistenceService,
  ],
})
export class PersistenceModule {}
