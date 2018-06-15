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
    async getUserById(args) {
        return this.usersPersistence.getById(args.id);
    }

    @Mutation('addUser')
    async createUser(_,  {user}) {
        return this.usersPersistence.createUser(user);
    }

    @Mutation('updateUser')
    async updateUser(_,  {id, user}) {
        return this.usersPersistence.updateUser(id, user);
    }

    @Mutation('deleteUser')
    async deleteUser(_,  {id}) {
        return this.usersPersistence.deleteUser(id);
    }
}