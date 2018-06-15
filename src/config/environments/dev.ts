
import { Config } from './config.model';

export const config: Config = {
    db: {
        connectionString: 'mongodb://admin:Aa123456@ds016118.mlab.com:16128/msw-dev',
        // connectionString: 'mongodb://localhost',
        dbName: 'msw-dev',
    },
};
