import { Config } from './config.model';

export const config: Config = {
    db: {
        connectionString: 'mongodb://localhost:27018/msw-e2e-test',
        dbName: 'msw-e2e-test',
    },
};
