jest.mock('mongodb');

import { ConnectivityService } from './connectivity.service';
import { MongoClient } from 'mongodb';

describe('connectivity.service', () => {
    let connectivityService: ConnectivityService;

    beforeEach(() => {
        connectivityService = new ConnectivityService();
    });

    it('should  retrun true on success connection ', async () => {
        (MongoClient.connect as jest.Mock).mockImplementationOnce(() => 'sucess');
        const dbValid = await connectivityService.validateDBConnection();
        expect(dbValid).toBe(true);
    });

    it('should return false on unsucessful connection', async () => {
        expect.assertions(1);
        (MongoClient.connect as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });
        const dbValid = await connectivityService.validateDBConnection();
        expect(dbValid).toBe(false);
    });
});
