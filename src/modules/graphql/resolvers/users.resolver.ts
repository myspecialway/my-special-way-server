import { ClassPersistenceService } from './../../persistence/class.persistence.service';
import { Resolver, Query, Mutation, ResolveProperty } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { Asset, checkAndGetBasePermission, DBOperation } from '../../permissions/permission.interface';
import { Get } from '../../../utils/get';
import { ObjectID } from 'mongodb';

@Resolver('User')
export class UsersResolver {
  constructor(private usersPersistence: UsersPersistenceService, private classPersistence: ClassPersistenceService) {}

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
    checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.USER);
    // TODO: Handle errors!!!!
    const [, response] = await this.usersPersistence.updateUserPassword(username, password);
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
}
