import { Module, LoggerService } from '@nestjs/common';
import { DbService } from './db.service';
import { getConfig } from '../../config/config-loader';
import { UsersPersistenceService, ClassPersistenceService, StudentPersistenceService } from '.';

@Module({
    providers: [
        DbService,
        UsersPersistenceService,
        ClassPersistenceService,
        StudentPersistenceService,
    ],
    exports: [
        UsersPersistenceService,
        ClassPersistenceService,
        StudentPersistenceService,
    ],
})
export class PersistenceModule {
    constructor(private dbService: DbService) {
        const config = getConfig();
        dbService.initConnection(config.db.connectionString, config.db.dbName);
    }
}
