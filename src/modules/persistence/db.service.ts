import { MongoClient, Db } from 'mongodb';
import { Injectable, Logger } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces';

const MONGO_CONNECTION_ERROR_MESSAGE = 'no connection available please connect using db.initConnection function';

@Injectable()
export class DbService {
    private db: Db;
    private logger = new Logger('DbService', true);

    async initConnection(connectionString: string, dbName: string) {
        this.logger.log(`initConnection:: initiating connection to ${connectionString}`);
        if (this.db) {
            this.logger.warn('initConnection:: connection already established');
            return;
        }
        try {
            const connection = await MongoClient.connect(connectionString);
            this.db = connection.db(dbName);
            this.logger.log('initConnection:: connection initiated');
        } catch (error) {
            this.logger.error('initConnection:: error connecting to db', error.stack);
            throw error;
        }
    }

    getConnection(): Db {
        if (!this.db) {
            const connectionError = new Error(MONGO_CONNECTION_ERROR_MESSAGE);
            this.logger.error(`initConnection:: ${MONGO_CONNECTION_ERROR_MESSAGE}`, connectionError.stack);
            throw connectionError;
        }

        return this.db;
    }
}

export function getDbServiceProvider(connectionString: string, dbName: string): FactoryProvider {
    return {
        provide: DbService,
        useFactory: async () => {
            const dbService = new DbService();
            await dbService.initConnection(connectionString, dbName);

            return dbService;
        },
    };
}
