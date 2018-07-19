import { ConnectivityController } from './connectivity.controller';
import { ConnectivityService } from '../connectivity-service/connectivity.service';

describe('connectivity controller', () => {

    let connectivityController: ConnectivityController;
    let connectivityServiceMock: Partial<ConnectivityService>;
    let responseMock;
    beforeEach(() => {
        connectivityServiceMock = {
            validateDBConnection: jest.fn(),
        };
        responseMock = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        connectivityController = new ConnectivityController(connectivityServiceMock as ConnectivityService);
    });

    it('should return 200 if connection to db success', async () => {
        const isDBValid = connectivityServiceMock.validateDBConnection as jest.Mock<Promise<boolean>>;
        isDBValid.mockReturnValueOnce(Promise.resolve(true));
        await connectivityController.readiness(responseMock);
        expect(responseMock.json).toHaveBeenCalledWith({message: 'db connection is valid'});

    });

    it('should return 500 server error if error happened', async () => {
        const isDBValid = connectivityServiceMock.validateDBConnection as jest.Mock<Promise<boolean>>;
        isDBValid.mockReturnValueOnce(Promise.resolve(false));
        await connectivityController.readiness(responseMock);
        expect(responseMock.json).toHaveBeenCalledWith({message: 'db connection error'});
        expect(responseMock.status).toHaveBeenCalledWith(500);

    });
});
