import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { LocationsPersistenceService } from '../../persistence/locations.persistence.service';

@Resolver('Locations')
export class LocationsResolver {
    constructor(private locationsPersistence: LocationsPersistenceService) { }

    @Query('locations')
    async getLocations() {
        return this.locationsPersistence.getAll();
    }

  @Query('locationById')
  async getLocationById(args) {
    return await this.locationsPersistence.getById(args.id);
  }

  @Mutation('createLocation')
  async createLocation({ location }) {
    return this.locationsPersistence.createLocation(location);
  }

  @Mutation('updateLocation')
  async updateLocation({id, location}) {
    return this.locationsPersistence.updateLocation(id, location);
  }

  @Mutation('deleteLocation')
  async deleteLocation({id}) {
    return this.locationsPersistence.deleteLocation(id);
  }
}
