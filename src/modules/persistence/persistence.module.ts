import { Module, OnModuleInit } from '@nestjs/common';
import { DbService } from './db.service';
import { getConfig } from '../../config/config-loader';
import { ClassPersistenceService } from './class.persistence.service';
import { UsersPersistenceService } from './users.persistence.service';
import { LessonPersistenceService } from './lesson.persistence.service';
import { SchedulePersistenceService } from './schedule.persistence.service';

@Module({
    providers: [
        DbService,
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
export class PersistenceModule implements OnModuleInit {
    constructor(private dbService: DbService) { }

    async onModuleInit() {
        const config = getConfig();
        await this.dbService.initConnection(config.db.connectionString, config.db.dbName);
    }
}
