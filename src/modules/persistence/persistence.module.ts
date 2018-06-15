import { Module, LoggerService } from '@nestjs/common';
import { DbService } from './db.service';
import { UsersPersistenceService, ClassPersistenceService } from '.';
import { getConfig } from './../../config';

@Module({
    providers: [
        DbService,
        UsersPersistenceService,
        ClassPersistenceService,
    ],
    exports: [
        UsersPersistenceService,
        ClassPersistenceService,
    ],
})
export class PersistenceModule {
    constructor(private dbService: DbService) {
        const config = getConfig();
        dbService.initConnection(config.db.connectionString, config.db.dbName);
    }
}
