'use strict';

import LocationDbModel from 'models/location.db.model';

export interface ILocationsPersistenceService {
    readonly getAll: () => Promise<LocationDbModel[]>;
}
