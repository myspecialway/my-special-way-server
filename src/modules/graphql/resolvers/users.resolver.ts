import { Resolver, Query } from '@nestjs/graphql';
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
}