jest.mock('mongodb');
import * as common from '@nestjs/common';
import { LocationsPersistenceService } from './locations.persistence.service';
import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';

describe('locations persistence', () => {
    let locationsPersistanceService: LocationsPersistenceService;
    let dbServiceMock: Partial<DbService>;
    const locationsMockArray = [{
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

        const users = await locationsPersistanceService.getAll();
        expect(users).toEqual(locationsMockArray);
    });

    it('should throw an error on error through getAll function', async () => {
        expect.assertions(1);
        (dbServiceMock.getConnection().collection('locations').find as jest.Mock).mockImplementationOnce(() => {
            throw new Error('mock error');
        });

        await locationsPersistanceService.getAll().catch((error) => expect(error).not.toBeUndefined());
    });
});
