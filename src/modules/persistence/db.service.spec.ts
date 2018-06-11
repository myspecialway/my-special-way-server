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

    it('should throw an error if getConnection has been called before connection has been established', () => {
        expect.assertions(1);

        expect(dbService.getConnection.bind(dbService)).toThrow();
    });

    it('should throw an error on unsucessful connection', async () => {
        expect.assertions(1);
        (MongoClient.connect as jest.Mock).mockReturnValueOnce(Promise.resolve({
            db: jest.fn().mockImplementationOnce(() => {
                throw new Error('mock error');
            }),
        }));

        dbService.initConnection('url', 'db').catch(error => expect(error).toBeDefined());
    });

    it('should return connection from getConnection', async () => {
        (MongoClient.connect as jest.Mock).mockReturnValueOnce(Promise.resolve({
            db: jest.fn().mockReturnValue('dbmock'),
        }));

        await dbService.initConnection('url', 'db');

        const db = dbService.getConnection();
        expect(db).toBeDefined();
    });
});