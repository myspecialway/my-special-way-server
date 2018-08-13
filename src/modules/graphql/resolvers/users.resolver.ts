import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import {UserRole} from "../../../models/user.db.model";

@Resolver('User')
export class UsersResolver {
    constructor(private usersPersistence: UsersPersistenceService) { }

    @Query('users')
    async getUsers(_, {  }, context) {
        if (context.user && context.user.role == UserRole.STUDENT) {
            throw new Error('No Authorized.');
        }
        return this.usersPersistence.getAll();
    }

    @Query('user')
    async getUserById(obj, args, context, info) {
        if (context.user && context.user.role == UserRole.STUDENT && context.user.id != args.id) {
            throw new Error('No Authorized.');
        }
        return this.usersPersistence.getById(args.id);
    }

    @Mutation('createUser')
    async createUser(_, { user }, context) {
        if (context.user && context.user.role == UserRole.STUDENT) {
            throw new Error('No Authorized.');
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.createUser(user);
        return response;
    }

    @Mutation('updateUser')
    async updateUser(_, { id, user }, context) {
        if (context.user && context.user.role == UserRole.STUDENT) {
            throw new Error('No Authorized.');
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.updateUser(id, user);
        return response;
    }

    @Mutation('deleteUser')
    async deleteUser(_, { id }, context) {
        if (context.user && context.user.role == UserRole.STUDENT) {
            throw new Error('No Authorized.');
        }
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
}
