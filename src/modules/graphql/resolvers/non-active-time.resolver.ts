import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { Asset, checkAndGetBasePermission, DBOperation } from '../../permissions/permission.interface';
import { Get } from '../../../utils/get';
import { NonActiveTimePersistenceService } from '../../persistence/non-active-time.persistence.service';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';

@Resolver('NonActiveTime')
export class NonActiveTimeResolver {
  constructor(
    private nonActiveTimePersistence: NonActiveTimePersistenceService,
    private classPersistence: ClassPersistenceService,
  ) {}

  @Query('nonActiveTimes')
  async getNonActiveTimes(_, {}, context) {
    checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.ANY);
    return this.nonActiveTimePersistence.getAll();
  }

  @Mutation('createNonActiveTime')
  async createNonActiveTime(_, { nonActiveTime }, context) {
    checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.CREATE, Asset.ANY);
    return this.nonActiveTimePersistence.create(nonActiveTime);
  }

  @Mutation('updateNonActiveTime')
  async updateNonActiveTime(_, { id, nonActiveTime }, context) {
    checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.ANY);
    return this.nonActiveTimePersistence.update(id, nonActiveTime);
  }

  @Mutation('deleteNonActiveTime')
  async deleteNonActiveTime(_, { id }, context) {
    checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.ANY);
    return this.nonActiveTimePersistence.delete(id);
  }

  @ResolveProperty('classes')
  async getNonActiveTimeClasses(nonActiveTime, {}, context) {
    const classes = await nonActiveTime.classesIds.map((classId) => this.classPersistence.getById(classId));
    return classes;
  }
}
