import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import {Asset, checkAndGetBasePermission, DBOperation, NO_PERMISSION, Permission, Permissions} from '../../permissions/permission.interface';
import {Get} from '../../../utils/get';

@Resolver('User')
export class UsersResolver {
    constructor(private usersPersistence: UsersPersistenceService) { }

    @Query('users')
    async getUsers(_, {  }, context) {
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
        // TODO: Handle errors!!!!
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

    @Mutation('deleteUser')
    async deleteUser(_, { id }, context) {
        checkAndGetBasePermission(Get.getObject(context, 'user'), DBOperation.DELETE, Asset.USER);
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
}
