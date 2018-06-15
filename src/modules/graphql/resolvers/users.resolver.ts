import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';

@Resolver('User')
export class UsersResolver {
    constructor(private usersPersistence: UsersPersistenceService) { }

    @Query('users')
    async getUsers(obj, args, context, info) {
        return this.usersPersistence.getAll();
    }

    @Query('user')
    async getUserById(obj, args, context, info) {
        return this.usersPersistence.getById(args.id);
    }

    @Mutation('addUser')
    async createUser(_,  {user}) {
        return this.usersPersistence.addUser(user);
    }

    // @Mutation('updateUser')
    // async updateUser(obj, args, context, info) {
    //     return this.usersPersistence.updateUser(args.id, obj);
    // }

    // @Mutation('deleteUser')
    // async deleteUser(obj, args, context, info) {
    //     return this.usersPersistence.deleteUser(args.id);
    // }
}