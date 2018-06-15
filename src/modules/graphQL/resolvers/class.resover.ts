import { Resolver, Query, ResolveProperty } from '@nestjs/graphql';
import { ClassPersistenceService, UsersPersistenceService } from '../../persistence/';

@Resolver('Class')
export class ClassResolver {
    constructor(private classPersistence: ClassPersistenceService, private userPersistenceService: UsersPersistenceService) {}

    @Query('classes')
    async getClasses(obj, args, context, info) {
        return this.classPersistence.getAll();
    }

    @Query('classById')
    async getClassById(obj, args, context, info) {
        return this.classPersistence.getById(args.id);
    }

    @Query('classByName')
    async getClassByName(obj, args, context, info) {
        return this.classPersistence.getByName(args.name);
    }

    @ResolveProperty('students')
    async getClassStudents(obj, args, context) {
        return this.userPersistenceService.getClassStudents(obj._id.toHexString());
    }
}