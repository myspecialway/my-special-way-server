import { Module } from '@nestjs/common';
import { getDbServiceProvider } from './db.service';
import { ClassPersistenceService } from './class.persistence.service';
import { UsersPersistenceService } from './users.persistence.service';
import { LessonPersistenceService } from './lesson.persistence.service';
import { SchedulePersistenceService } from './schedule.persistence.service';
import { LocationsPersistenceService } from './locations.persistence.service';
import { getConfig } from '../../config/config-loader';
import { StudentPermissionService } from '../permissions/student.premission.service';
import { FileSystemPersistenceService } from './file-system.persistence.service';

@Module({
  providers: [
    getDbServiceProvider(getConfig().DB_CONNECTION_STRING, getConfig().DB_NAME),
    UsersPersistenceService,
    ClassPersistenceService,
    LessonPersistenceService,
    SchedulePersistenceService,
    LocationsPersistenceService,
    StudentPermissionService,
    FileSystemPersistenceService,
  ],
  exports: [
    UsersPersistenceService,
    ClassPersistenceService,
    LessonPersistenceService,
    SchedulePersistenceService,
    LocationsPersistenceService,
    StudentPermissionService,
    FileSystemPersistenceService,
  ],
})
export class PersistenceModule {}
