'use strict';

import LocationDbModel from 'models/location.db.model';

export interface ILocationsPersistenceService {
    readonly getAll: () => Promise<LocationDbModel[]>;
    readonly getById: (id: string) => Promise<LocationDbModel>;
    createLocation: (location: LocationDbModel) => Promise<LocationDbModel>;
    updateLocation: (id: string, locationObj: LocationDbModel) => Promise<LocationDbModel>;
    deleteLocation: (id: string) => Promise<number>;
}
