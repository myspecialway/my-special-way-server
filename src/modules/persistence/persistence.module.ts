import { Module, LoggerService } from '@nestjs/common';
import { DbService } from './db.service';
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
        dbService.initConnection('mongodb://localhost', 'msw-dev');
    }
}