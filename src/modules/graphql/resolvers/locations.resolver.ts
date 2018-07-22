import { Resolver, Query } from '@nestjs/graphql';
import { LocationsPersistenceService } from '../../persistence/locations.persistence.service';

@Resolver('Locations')
export class LocationsResolver {
    constructor(private locationsPersistence: LocationsPersistenceService) { }

    @Query('locations')
    async getLocations() {
        return this.locationsPersistence.getAll();
    }
}
