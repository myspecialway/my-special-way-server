import { Resolver, Query, ResolveProperty } from '@nestjs/graphql';
import { ClassPersistenceService } from '../../persistence/';

@Resolver('Student')
export class StudentResolver {
    constructor(private classPersistence: ClassPersistenceService) {}

    @ResolveProperty('class')
    async getStudentClass(obj, args, context) {
        return this.classPersistence.getById(obj.class_id);
    }
}