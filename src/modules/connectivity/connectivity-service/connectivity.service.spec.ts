jest.mock('mongodb');
jest.mock('../../../config/config-loader');

import { ConnectivityService } from './connectivity.service';
import { MongoClient } from 'mongodb';
import { getConfig } from '../../../config/config-loader';
import { ProcessEnvConfig } from '../../../config/config-interface';

describe('connectivity.service', () => {
    let connectivityService: ConnectivityService;

    beforeEach(() => {
        (getConfig as jest.Mock).mockReturnValue({
            DB_CONNECTION_STRING: '',
            DB_NAME: '',
        } as ProcessEnvConfig);

        connectivityService = new ConnectivityService();
    });

    it('should  retrun true on success connection ', async () => {
        (MongoClient.connect as jest.Mock).mockReturnValue(Promise.resolve());
        const dbValid = await connectivityService.validateDBConnection();
        expect(dbValid).toBe(true);
    });

    it('should return false on unsucessful connection', async () => {
        expect.assertions(1);
        (MongoClient.connect as jest.Mock).mockReturnValue(Promise.reject(new Error()));
        const dbValid = await connectivityService.validateDBConnection();
        expect(dbValid).toBe(false);
    });
});
