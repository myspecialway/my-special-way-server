import { Config } from './config.model';

export const config: Config = {
    db: {
        connectionString: 'mongodb://mongodb:27017/msw-test',
        dbName: 'msw-test',
    },
};
