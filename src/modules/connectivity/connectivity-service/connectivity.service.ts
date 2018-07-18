
import { MongoClient } from 'mongodb';
import { Injectable, Logger } from '@nestjs/common';
import { getConfig } from '../../../config/config-loader';

@Injectable()
export class ConnectivityService {

    private logger = new Logger('ConnectivityService');
    private readonly connectionString = getConfig().db.connectionString;

    async validateDBConnection() {
        this.logger.log(`validateDBConnection:: test connection to ${this.connectionString}`);
        try {
            await MongoClient.connect(this.connectionString);
            this.logger.log('validateDBConnection:: test connection initiated');
            return true;
        } catch (error) {
            this.logger.error('validateDBConnection:: error connecting to db', error.stack);
            return false;
        }
    }
}
