import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';

@Resolver('User')
export class UsersResolver {
    constructor(private usersPersistence: UsersPersistenceService) { }

    @Query('getUsers')
    async getUsers() {
        return this.usersPersistence.getAll();
    }

    @Query('getUser')
    async getUserById(obj, args, context, info) {
        return this.usersPersistence.getById(args.id);
    }

    @Mutation('createUser')
    async createUser(_, { user }) {
        // TODO: Handle errors!!!!
        const [__, response] = await this.usersPersistence.createUser(user);
        return response;
    }

    @Mutation('updateUser')
    async updateUser(_, { id, user }) {
        // TODO: Handle errors!!!!
        const [__, response] = await this.usersPersistence.updateUser(id, user);
        return response;
    }

    @Mutation('deleteUser')
    async deleteUser(_, { id }) {
        // TODO: Handle errors!!!!
        const [__, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
}