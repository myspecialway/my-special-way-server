import { Module, LoggerService } from '@nestjs/common';
import { DbService } from './db.service';
import { getConfig } from '../../config/config-loader';
import { ClassPersistenceService } from './class.persistence.service';
import { UsersPersistenceService } from './users.persistence.service';
import { LessonPersistenceService } from './lesson.persistence.service';

@Module({
    providers: [
        DbService,
        UsersPersistenceService,
        ClassPersistenceService,
        LessonPersistenceService,
    ],
    exports: [
        UsersPersistenceService,
        ClassPersistenceService,
        LessonPersistenceService,
    ],
})
export class PersistenceModule {
    constructor(private dbService: DbService) {
        const config = getConfig();
        dbService.initConnection(config.db.connectionString, config.db.dbName);
    }
}
