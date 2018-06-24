import { Module, LoggerService, OnModuleInit } from '@nestjs/common';
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
export class PersistenceModule implements OnModuleInit {
    constructor(private dbService: DbService) { }

    async onModuleInit() {
        const config = getConfig();
        await this.dbService.initConnection(config.db.connectionString, config.db.dbName);
    }
}
