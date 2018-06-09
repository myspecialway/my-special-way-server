jest.mock('mongodb');

import { DbService } from './db.service';
import { MongoClient } from 'mongodb';

describe('db service', () => {
    let dbService: DbService;
    beforeEach(() => {
        dbService = new DbService();
    });

    it('should initiate connection successfuly only once', async () => {
        (MongoClient.connect as jest.Mock).mockReturnValueOnce(Promise.resolve({
            db: jest.fn().mockReturnValue('dbmock'),
        }));

        await dbService.initConnection('url', 'db');
        await dbService.initConnection('url', 'db');

        expect(MongoClient.connect).toHaveBeenCalledTimes(1);
    });
});