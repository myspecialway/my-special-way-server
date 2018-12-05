import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Asset, checkAndGetBasePermission, DBOperation } from '../../permissions/permission.interface';
import { Get } from '../../../utils/get';
import { NonActiveTimePersistenceService } from '../../persistence/non-active-time.persistence.service';

@Resolver('NonActiveTime')
export class NonActiveTimeResolver {
  constructor(private nonActiveTimePersistence: NonActiveTimePersistenceService) {}

  @Query('nonActiveTimes')
  async getNonActiveTimes(_, {}, context) {
    // checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.ANY);
    return this.nonActiveTimePersistence.getAll();
  }

  @Mutation('createNonActiveTime')
  async createNonActiveTime(_, { nonActiveTime }, context) {
    // checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.CREATE, Asset.ANY);
    return this.nonActiveTimePersistence.createNonActiveTime(nonActiveTime);
  }

  @Mutation('updateNonActiveTime')
  async updateNonActiveTime(_, { id, nonActiveTime }, context) {
    // checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.ANY);
    return this.nonActiveTimePersistence.updateNonActiveTime(id, nonActiveTime);
  }

  @Mutation('deleteNonActiveTime')
  async deleteNonActiveTime(_, { id }, context) {
    // checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.ANY);
    return this.nonActiveTimePersistence.deleteNonActiveTime(id);
  }
}
