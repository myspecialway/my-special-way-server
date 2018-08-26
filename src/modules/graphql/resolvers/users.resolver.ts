import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import {Asset, checkAndGetBasePermission, DBOperation, NO_PERMISSION, Permission, Permissions} from '../../permissions/permission.interface';
import {Get} from '../../../utils/get';

@Resolver('User')
export class UsersResolver {
    constructor(private usersPersistence: UsersPersistenceService) { }

    @Query('users')
    async getUsers(_, {  }, context) {
        if (checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.USER) === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        return this.usersPersistence.getAll();
    }

    @Query('user')
    async getUserById(obj, args, context, info) {
        if (checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.READ, Asset.USER) === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        return this.usersPersistence.getById(args.id);
    }

    @Mutation('createUser')
    async createUser(_, { user }, context) {
        if (checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.CREATE, Asset.USER) === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.createUser(user);
        return response;
    }

    @Mutation('updateUser')
    async updateUser(_, { id, user }, context) {
        if (checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.UPDATE, Asset.USER) === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.updateUser(id, user);
        return response;
    }

    @Mutation('deleteUser')
    async deleteUser(_, { id }, context) {
        if (checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.USER) === Permission.FORBID) {
            throw new Error(NO_PERMISSION);
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
}
