import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';

@Resolver('User')
export class UsersResolver {
    constructor(private _usersPersistence: UsersPersistenceService) { }

    @Query('users')
    async getUsers() {
        return this._usersPersistence.getAll();
    }

    @Query('user')
    async getUserById(obj, args, context, info) {
        return this._usersPersistence.getById(args.id);
    }

    @Mutation('createUser')
    async createUser(_, { user }) {
        // TODO: Handle errors!!!!
        const [__, response] = await this._usersPersistence.createUser(user);
        return response;
    }

    @Mutation('updateUser')
    async updateUser(_, { id, user }) {
        // TODO: Handle errors!!!!
        const [__, response] = await this._usersPersistence.updateUser(id, user);
        return response;
    }

    @Mutation('deleteUser')
    async deleteUser(_, { id }) {
        // TODO: Handle errors!!!!
        const [__, response] = await this._usersPersistence.deleteUser(id);
        return response;
    }
}