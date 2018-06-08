import { Resolver, Query } from '@nestjs/graphql';
import { UsersPersistanceService } from '../../persistance/users.persistance';

@Resolver('User')
export class UsersResolver {
    constructor(private usersPersistance: UsersPersistanceService) { }

    @Query('users')
    async getUsers(obj, args, context, info) {
        return this.usersPersistance.getAll();
    }

    @Query('user')
    async getUserById(obj, args, context, info) {
        return this.usersPersistance.getById(args.id);
    }
}