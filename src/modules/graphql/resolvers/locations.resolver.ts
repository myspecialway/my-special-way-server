import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { LocationsPersistenceService } from '../../persistence/locations.persistence.service';

@Resolver('Locations')
export class LocationsResolver {
  constructor(private locationsPersistence: LocationsPersistenceService) {}

  @Query('locations')
  async getLocations(_, {}, context) {
    return this.locationsPersistence.getAll();
  }

  @Query('locationById')
  async getLocationById(obj, args, context, info) {
    return await this.locationsPersistence.getById(args.id);
  }

  @Query('locationsByMapId')
  async getLocationsByMapId(obj, args, context, info) {
    const results = await Promise.all([
      this.locationsPersistence.getLocationsFromTypeStep(args.floor),
      this.locationsPersistence.getByImageId(args.image_id),
    ]);
    const zipArray = [].concat.apply([], results);
    return zipArray;
  }

  @Mutation('createLocation')
  async createLocation(_, { location }, context) {
    return this.locationsPersistence.createLocation(location);
  }

  @Mutation('updateLocation')
  async updateLocation(_, { id, location }, context) {
    return this.locationsPersistence.updateLocation(id, location);
  }

  @Mutation('deleteLocation')
  async deleteLocation(_, { id }, context) {
    return this.locationsPersistence.deleteLocation(id);
  }
}
