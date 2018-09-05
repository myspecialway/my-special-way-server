import { LocationsPersistenceService } from '../../persistence/locations.persistence.service';
import { LocationsResolver } from './locations.resolver';

describe('locations resolver', () => {
    const MOCK_LOCATIONS =  [{
        "name": "פטל כיתת",
        "disabled": true,
        "position": {
            "latitude": 31.986417758011342,
            "longitude": 34.91077744955874,
            "floor": 0
        }
    },
    {
        "name": "כיתת סחלב",
        "disabled": false,
        "position": {
            "latitude": 31.986419691740092,
            "longitude": 34.91078563034535,
            "floor": 1
        }
    }];
    let locationsResolver: LocationsResolver;
    let locationsPersistence: Partial<LocationsPersistenceService>;

    beforeEach(() => {
        locationsPersistence = {
            getAll: jest.fn(),
        };

        locationsResolver = new LocationsResolver(locationsPersistence as LocationsPersistenceService);
    });

    it('should call getAll function and return locations on getStudents', async () => {
        (locationsPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve(MOCK_LOCATIONS));

        const response = await locationsResolver.getLocations(null, {}, null);
        expect(response).toEqual(MOCK_LOCATIONS);
        expect(locationsPersistence.getAll).toHaveBeenCalled();
    });
});