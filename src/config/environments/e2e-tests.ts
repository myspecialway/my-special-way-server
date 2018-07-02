import { Config } from './config.model';

export const config: Config = {
    db: {
        connectionString: 'mongodb://mongodb:27017/msw-test',
        dbName: 'msw-test',
    },
    schedule: {
        columns: ['A', 'B', 'C', 'D', 'E', 'F'],
        rows: 15,
        hours: [
            '07:30 - 08:00',
            '08:00 - 08:50',
            '08:50 - 09:35',
            '09:35 - 10:00',
            '10:00 - 10:30',
            '10:30 - 11:15',
            '11:15 - 12:00',
            '12:00 - 12:45',
            '12:45 - 13:15',
            '13:15 - 13:45',
            '13:45 - 14:30',
            '14:30 - 15:15',
            '15:15 - 16:00',
            '16:00 - 16:30',
            '16:30 - 16:45',
        ],
    },
};
