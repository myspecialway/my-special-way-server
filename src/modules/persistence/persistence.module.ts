import { Module, LoggerService } from '@nestjs/common';
import { DbService } from './db.service';
import { getConfig } from '../../config/config-loader';
import { UsersPersistenceService, ClassPersistenceService } from '.';

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
