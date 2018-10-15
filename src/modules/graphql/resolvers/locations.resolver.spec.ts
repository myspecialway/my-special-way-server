import { LocationsPersistenceService } from '../../persistence/locations.persistence.service';
import { LocationsResolver } from './locations.resolver';

describe('locations resolver', () => {
  const MOCK_LOCATIONS = [{
    id: '1',
    name: 'פטל כיתת',
    disabled: true,
    location_id: 'A',
    position: {
      latitude: 31.986417758011342,
      longitude: 34.91077744955874,
      floor: 0,
    },
  },
    {
      id: '2',
      name: 'כיתת סחלב',
      disabled: false,
      location_id: 'A_0',
      position: {
        latitude: 31.986419691740092,
        longitude: 34.91078563034535,
        floor: 1,
      },
    }];
  let locationsResolver: LocationsResolver;
  let locationsPersistence: Partial<LocationsPersistenceService>;

  beforeEach(() => {
    locationsPersistence = {
      getAll: jest.fn(),
      getById: jest.fn(),
      createLocation: jest.fn(),
      updateLocation: jest.fn(),
      deleteLocation: jest.fn(),
    };

    locationsResolver = new LocationsResolver(locationsPersistence as LocationsPersistenceService);
  });

  it('should call getAll function and return locations on getStudents', async () => {
    (locationsPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve(MOCK_LOCATIONS));

    const response = await locationsResolver.getLocations(null, {}, null);
    expect(response).toEqual(MOCK_LOCATIONS);
    expect(locationsPersistence.getAll).toHaveBeenCalled();
  });

  it('should call getById function and return location', async () => {
    (locationsPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ id: '1', name: 'פטל כיתת'}));

    const response = await locationsResolver.getLocationById(null, { id: '1' }, MOCK_LOCATIONS, null);
    expect(response).toEqual({ id: '1', name: 'פטל כיתת'});
    expect(locationsPersistence.getById).toHaveBeenCalledWith('1');
  });

  it('should call createLocation and return new created location', async () => {
    const expected = { name: 'כיתת דקל', id: '3' };
    (locationsPersistence.createLocation as jest.Mock).mockReturnValue(Promise.resolve(expected));
    const result = await locationsResolver.createLocation(null, { location: expected }, MOCK_LOCATIONS);
    expect(result).toEqual(expected);
    expect(locationsPersistence.createLocation).toHaveBeenCalledWith(expected);
  });

  it('should call updateLocation and return updated location', async () => {
    const expected = { name: 'כיתת דקל', id: '1' };
    (locationsPersistence.updateLocation as jest.Mock).mockReturnValue(Promise.resolve(expected));
    const result = await locationsResolver.updateLocation(null, { id: '5b217b030825622c97d3757f', location: expected }, MOCK_LOCATIONS);
    expect(result).toEqual(expected);
    expect(locationsPersistence.updateLocation).toHaveBeenLastCalledWith('5b217b030825622c97d3757f', expected);
  });

  it('should call deleteLocation and return the number of locations deleted', async () => {
    (locationsPersistence.deleteLocation as jest.Mock).mockReturnValue(Promise.resolve(1));
    const result = await locationsResolver.deleteLocation(null, { id: '5b217b030825622c97d3757f' }, MOCK_LOCATIONS);
    expect(result).toEqual(1);
    expect(locationsPersistence.deleteLocation).toHaveBeenCalledWith('5b217b030825622c97d3757f');
  });
});
