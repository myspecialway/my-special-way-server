import { Module } from '@nestjs/common';
import { getDbServiceProvider } from './db.service';
import { ClassPersistenceService } from './class.persistence.service';
import { UsersPersistenceService } from './users.persistence.service';
import { LessonPersistenceService } from './lesson.persistence.service';
import { SchedulePersistenceService } from './schedule.persistence.service';
import { getConfig } from '../../config/config-loader';

@Module({
    providers: [
        getDbServiceProvider(getConfig().DB_CONNECTION_STRING, getConfig().DB_NAME),
        UsersPersistenceService,
        ClassPersistenceService,
        LessonPersistenceService,
        SchedulePersistenceService,
    ],
    exports: [
        UsersPersistenceService,
        ClassPersistenceService,
        LessonPersistenceService,
        SchedulePersistenceService,
    ],
})
export class PersistenceModule { }
