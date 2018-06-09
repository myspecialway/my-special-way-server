import { MongoClient, Db } from 'mongodb';
import { LoggerService, Injectable, Logger as logger } from '@nestjs/common';

const MONGO_CONNECTION_ERROR_MESSAGE = 'no connection available please connect using db.initConnection function';

@Injectable()
export class DbService {
    public db: Db;
    async initConnection(connectionString: string, dbName: string) {
        if (this.db) {
            logger.warn('initConnection:: connection already established', 'db');
            return;
        }

        try {
            const connection = await MongoClient.connect(connectionString);
            this.db = connection.db(dbName);
            logger.log('initConnection:: connection initiated', 'db');
        } catch (error) {
            logger.error('initConnection:: error connecting to db', error.stack, 'db');
            throw error;
        }
    }

    getConnection() {
        if (!this.db) {
            const connectionError = new Error(MONGO_CONNECTION_ERROR_MESSAGE);
            logger.error(`initConnection:: ${MONGO_CONNECTION_ERROR_MESSAGE}`, connectionError.stack, 'db');

            throw connectionError;
        }

        return this.db;
    }
}