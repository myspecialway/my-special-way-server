import { Module, LoggerService } from '@nestjs/common';
import { DbService } from './db.service';
import { RunConfig  as config } from './../../config';
import { UsersPersistenceService } from './users.persistence.service';

@Module({
    providers: [
        DbService,
        UsersPersistenceService,
    ],
    exports: [
        UsersPersistenceService,
    ],
})
export class PersistenceModule {
    constructor(private dbService: DbService) {
        dbService.initConnection(config.db.connectionString, config.db.dbName);
    }
}
