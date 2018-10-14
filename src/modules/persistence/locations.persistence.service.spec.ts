jest.mock('mongodb');
import * as common from '@nestjs/common';
import { LocationsPersistenceService } from './locations.persistence.service';
import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';

describe('locations persistence', () => {
  let locationsPersistanceService: LocationsPersistenceService;
  let dbServiceMock: Partial<DbService>;
  const locationsMockArray = [{
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

  beforeAll(() => {
    const errorFunc = common.Logger.error.bind(common.Logger);
    common.Logger.error = (message, trace, context) => {
      errorFunc(message, '', context);
    };
  });

  beforeEach(() => {
    dbServiceMock = {
      getConnection: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn(),
          findOne: jest.fn(),
          deleteOne: jest.fn(),
          replaceOne: jest.fn(),
          findOneAndUpdate: jest.fn(),
          insertOne: jest.fn(),
        } as Partial<Collection>),
      } as Partial<Db>),
    };

    locationsPersistanceService = new LocationsPersistenceService(dbServiceMock as DbService);
  });

  it('should get all locations successfuly on getAll', async () => {
    (dbServiceMock.getConnection().collection('locations').find as jest.Mock).mockReturnValueOnce({
      sort: jest.fn().mockReturnValueOnce({
        toArray: jest.fn().mockReturnValueOnce(locationsMockArray),
      }),
    });

    const locations = await locationsPersistanceService.getAll();
    expect(locations).toEqual(locationsMockArray);
  });

  it('should throw an error on error through getAll function', async () => {
    expect.assertions(1);
    (dbServiceMock.getConnection().collection('locations').find as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await locationsPersistanceService.getAll().catch((error) => expect(error).not.toBeUndefined());
  });

  it('should get location successfully on getById', async () => {
    (dbServiceMock.getConnection().collection('locations').findOne as jest.Mock).mockReturnValueOnce({
      name: 'פטל כיתת',
    });

    const location = await locationsPersistanceService.getById('507f1f77bcf86cd799439011');
    expect(location).toEqual({ name: 'פטל כיתת' });
  });

  it('should create a new location successfully on createLocation', async () => {
    expect.hasAssertions();
    const expected = { name: 'locationName' };
    (dbServiceMock.getConnection().collection('locations').findOne as jest.Mock).mockReturnValueOnce(expected);
    (dbServiceMock.getConnection().collection('locations').insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });

    const createdLocation = await locationsPersistanceService.createLocation({
      _id: '1',
      name: 'כיתת ניצן',
      disabled: false,
      location_id: 'B_0',
      position: {
        latitude: 31.986487941086967,
        longitude: 34.91072729229928,
        floor: 1,
      }});

    expect(createdLocation).toEqual(expected);
  });

  it('should update location successful on updateLocation', async () => {
    expect.hasAssertions();
    const expected = {
      name: 'כיתת ניצן',
      disabled: false,
      location_id: 'B_0',
      position: {
        latitude: 31.986487941086967,
        longitude: 34.91072729229928,
        floor: 1,
      }};
    (dbServiceMock.getConnection().collection('locations').findOne as jest.Mock).mockReturnValueOnce(
      {
        id: '1',
        name: 'פטל כיתת',
        disabled: true,
        location_id: 'A',
        position: {
          latitude: 31.986417758011342,
          longitude: 34.91077744955874,
          floor: 0,
        },
      });
    (dbServiceMock.getConnection().collection('locations').findOneAndUpdate as jest.Mock).mockReturnValueOnce(
      {value: {
          name: 'כיתת ניצן',
          disabled: false,
          location_id: 'B_0',
          position: {
            latitude: 31.986487941086967,
            longitude: 34.91072729229928,
            floor: 1,
          }}},
    );

    const updatedLocation = await locationsPersistanceService.updateLocation('1', {
      _id: '1',
      name: 'כיתת ניצן',
      disabled: false,
      location_id: 'B_0',
      position: {
        latitude: 31.986487941086967,
        longitude: 34.91072729229928,
        floor: 1,
      },
    });

    expect(updatedLocation).toEqual(expected);
  });

  it('should delete location successfully on deleteClass', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection('locations').deleteOne as jest.Mock).mockReturnValueOnce({
      deletedCount: 1,
    });

    const removedCount = await locationsPersistanceService.deleteLocation('507f1f77bcf86cd799439011');

    expect(removedCount).toBe(1);
  });
});
