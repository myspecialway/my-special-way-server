import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { LocationsPersistenceService } from '../../persistence/locations.persistence.service';
import { Asset, checkAndGetBasePermission, DBOperation, NO_PERMISSION, Permission } from '../../permissions/permission.interface';
import { Get } from '../../../utils/get';
import { UserDbModel } from '../../../models/user.db.model';
import { ClassDbModel } from '../../../models/class.db.model';
import LocationDbModel from '../../../models/location.db.model';

@Resolver('Locations')
export class LocationsResolver {
    constructor(private locationsPersistence: LocationsPersistenceService) { }

    @Query('locations')
    async getLocations(_, {}, context) {
        return this.locationsPersistence.getAll();
    }

  @Query('locationById')
  async getLocationById(obj, args, context, info) {
    return await this.locationsPersistence.getById(args.id);
  }

  @Mutation('createLocation')
  async createLocation(_, { location }, context) {
    return this.locationsPersistence.createLocation(location);
  }

  @Mutation('updateLocation')
  async updateLocation(_, {id, location}, context) {
    return this.locationsPersistence.updateLocation(id, location);
  }

  @Mutation('deleteLocation')
  async deleteLocation(_, {id}, context) {
    return this.locationsPersistence.deleteLocation(id);
  }
}
