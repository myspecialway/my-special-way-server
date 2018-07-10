import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';

@Resolver('User')
export class UsersResolver {
    constructor(private usersPersistence: UsersPersistenceService) { }

    @Query('users')
    async getUsers() {
        return this.usersPersistence.getAll();
    }

    @Query('user')
    async getUserById(obj, args, context, info) {
        return this.usersPersistence.getById(args.id);
    }

    @Mutation('createUser')
    async createUser(_, { user }) {
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.createUser(user);
        return response;
    }

    @Mutation('updateUser')
    async updateUser(_, { id, user }) {
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.updateUser(id, user);
        return response;
    }

    @Mutation('deleteUser')
    async deleteUser(_, { id }) {
        // TODO: Handle errors!!!!
        const [, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
}
