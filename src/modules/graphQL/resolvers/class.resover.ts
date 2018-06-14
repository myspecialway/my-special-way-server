import { Resolver, Query } from '@nestjs/graphql';
import { ClassPersistenceService } from '../../persistence/';

@Resolver('Class')
export class ClassResolver {
    constructor(private classPersistence: ClassPersistenceService) {}

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
}