import { ClassPersistenceService } from './../../persistence/class.persistence.service';
import { Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { Asset, checkAndGetBasePermission, DBOperation, Permission } from '../../permissions/permission.interface';
import { Get } from '../../../utils/get';
import { ObjectID } from 'mongodb';
import { UserTokenProfile } from '@models/user-token-profile.model';
import { NonActiveTimePersistenceService } from '../../persistence/non-active-time.persistence.service';
import { NonActiveTimeDbModel } from '@models/non-active-time.db.model';
import { UserRole } from '../../../models/user.db.model';

export const NO_PERMISSION = 'not permissions to execute command';

@Resolver('User')
export class UsersResolver {
  constructor(
    private usersPersistence: UsersPersistenceService,
    private classPersistence: ClassPersistenceService,
    private nonActiveTimePersistence: NonActiveTimePersistenceService,
  ) {}

  @Query('users')
  async getUsers(_, {}, context) {
    checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.USER);
    return this.usersPersistence.getAll();
  }

  @Query('user')
  async getUserById(obj, args, context, info) {
    checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.USER);
    return this.usersPersistence.getById(args.id);
  }

  @Mutation('createUser')
  async createUser(_, { user }, context) {
    checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.CREATE, Asset.USER);
    if (ObjectID.isValid(user.class_id)) {
      user.class_id = new ObjectID(user.class_id);
    }
    const [, response] = await this.usersPersistence.createUser(user);
    return response;
  }

  @Mutation('updateUser')
  async updateUser(_, { id, user }, context) {
    checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.USER);
    // TODO: Handle errors!!!!
    const [, response] = await this.usersPersistence.updateUser(id, user);
    return response;
  }

  @Mutation('updateUserPassword')
  async updateUserPassword(_, { username, password }, context) {
    const caller = Get.getObject(context, 'user') as UserTokenProfile;
    const permission = checkAndGetBasePermission(caller, DBOperation.UPDATE, Asset.USER);
    if (username !== caller.username) {
      throw new Error(NO_PERMISSION);
    }
    if (permission !== Permission.OWN) {
      throw new Error(NO_PERMISSION);
    }

    // TODO: Handle errors!!!!
    const [, response] = await this.usersPersistence.updateUserPassword(username, password);
    return response;
  }

  @Mutation('userForgetPassword')
  async userForgetPassword(_, { username }, context) {
    const caller = Get.getObject(context, 'user') as UserTokenProfile;
    if (caller.role !== UserRole.PRINCIPLE) {
      throw new Error(NO_PERMISSION);
    }
    const [, response] = await this.usersPersistence.userForgetPassword(username);
    return response;
  }

  @Mutation('deleteUser')
  async deleteUser(_, { id }, context) {
    checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.USER);
    // TODO: Handle errors!!!!
    const [, response] = await this.usersPersistence.deleteUser(id);
    return response;
  }

  @ResolveProperty('class')
  async getUserClass(obj, {}, context) {
    const objClassId = obj.class_id ? obj.class_id.toString() : '';
    return this.classPersistence.getById(objClassId);
  }

  @ResolveProperty('nonActiveTimes')
  async getNonActiveTimes(user, {}, context) {
    const classId: string = user.class_id.toString();
    const nonActiveTimes: NonActiveTimeDbModel[] = await this.nonActiveTimePersistence.getAll();
    const filteredNonActiveTimes: NonActiveTimeDbModel[] = nonActiveTimes.filter((time) => {
      if (time.isAllClassesEvent || time.classesIds.includes(classId.toString())) {
        return true;
      }
      return false;
    });
    return filteredNonActiveTimes;
  }
}
