import { MongoClient, Db } from 'mongodb';
import { LoggerService, Injectable, Logger as logger } from '@nestjs/common';

const MONGO_CONNECTION_ERROR_MESSAGE = 'no connection available please connect using db.initConnection function';

@Injectable()
export class DbService {
    private db: Db;

    public async initConnection(connectionString: string, dbName: string) {
        if (this.db) {
            logger.warn('DbService::initConnection:: connection already established', 'db');
            return;
        }
        try {
            const connection = await MongoClient.connect(connectionString);
            this.db = connection.db(dbName);
            logger.log('DbService::initConnection:: connection initiated', 'db');
        } catch (error) {
            logger.error('DbService::initConnection:: error connecting to db', error.stack, 'db');
            throw error;
        }
    }

    public getConnection(): Db {
        if (!this.db) {
            const connectionError = new Error(MONGO_CONNECTION_ERROR_MESSAGE);
            logger.error(`DbService::initConnection:: ${MONGO_CONNECTION_ERROR_MESSAGE}`, connectionError.stack, 'db');
            throw connectionError;
        }

        return this.db;
    }
}