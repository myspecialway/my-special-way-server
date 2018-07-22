import { Module } from '@nestjs/common';
import { getDbServiceProvider } from './db.service';
import { getConfig } from 'config/config-loader';
import { ClassPersistenceService } from './class.persistence.service';
import { UsersPersistenceService } from './users.persistence.service';
import { LessonPersistenceService } from './lesson.persistence.service';
import { SchedulePersistenceService } from './schedule.persistence.service';
import {LocationsPersistenceService } from './locations.persistence.service';

@Module({
    providers: [
        getDbServiceProvider(getConfig().db.connectionString, getConfig().db.dbName),
        UsersPersistenceService,
        ClassPersistenceService,
        LessonPersistenceService,
        SchedulePersistenceService,
        LocationsPersistenceService
    ],
    exports: [
        UsersPersistenceService,
        ClassPersistenceService,
        LessonPersistenceService,
        SchedulePersistenceService,
        LocationsPersistenceService
    ],
})
export class PersistenceModule { }
