import { Module, LoggerService } from '@nestjs/common';
import { DbService } from './db.service';
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
        dbService.initConnection('mongodb://admin:Aa123456@ds016118.mlab.com:16118/msw-dev', 'msw-dev');
    }
}
