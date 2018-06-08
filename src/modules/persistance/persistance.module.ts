import { Module, LoggerService } from '@nestjs/common';
import { DbService } from './db';
import { UsersPersistanceService } from './users.persistance';

@Module({
    providers: [
        DbService,
        UsersPersistanceService,
    ],
    exports: [
        UsersPersistanceService,
    ],
})
export class PersistanceModule {
    constructor(private dbService: DbService) {
        dbService.initConnection('mongodb://admin:Aa123456@ds016118.mlab.com:16118/msw-dev', 'msw-dev');
    }
}