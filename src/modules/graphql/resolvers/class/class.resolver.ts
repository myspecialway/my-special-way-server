import { Resolver, Query, ResolveProperty, Mutation } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../../persistence/users.persistence.service';
import { ClassPersistenceService } from '../../../persistence/class.persistence.service';
import { ClassDbModel } from '../../../../models/class.db.model';
import { ClassLogic } from './services/class-logic.service';

@Resolver('Class')
export class ClassResolver {
    constructor(
        private classPersistence: ClassPersistenceService,
        private userPersistenceService: UsersPersistenceService,
        private classLogic: ClassLogic,
    ) { }

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

    @ResolveProperty('schedule')
    getClassSchedule(obj) {
        return obj.schedule || [];
    }

    @ResolveProperty('students')
    async getStudentsByClassId(obj, args, context) {
        return this.userPersistenceService.getStudentsByClassId(obj._id.toString());
    }

    @Mutation('createClass')
    async createClass(obj, { class: newClass }: { class: ClassDbModel }) {
        // newClass.schedule = this.classLogic.buildDefaultSchedule(newClass.educationStage);
        return this.classPersistence.createClass(newClass);
    }

    @Mutation('updateClass')
    async updateClass(obj, { id, class: classObj }) {
        return this.classPersistence.updateClass(id, classObj);
    }

    @Mutation('deleteClass')
    async deleteClass(obj, { id }) {
        return this.classPersistence.deleteClass(id);
    }
}
