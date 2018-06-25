import { Config } from './config.model';

export const config: Config = {
    db: {
        connectionString: 'mongodb://localhost:27018/msw-test',
        dbName: 'msw-test',
    },
};
