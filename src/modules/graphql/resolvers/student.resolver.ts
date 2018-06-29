import { Resolver, Query, Mutation, ResolveProperty } from '@nestjs/graphql';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { SchedulePersistenceService } from '../../persistence/schedule.persistence.service';
import { UserRole } from '../../../models/user.db.model';


@Resolver('Student')
export class StudentResolver {
    constructor(
        private _usersPersistence: UsersPersistenceService,
        private _classPersistence: ClassPersistenceService,
        private _schedulePersistence: SchedulePersistenceService,
    ) { }

    @Query('students')
    public async getStudents() {
        return this._usersPersistence.getUsersByFilters({role: UserRole.STUDENT});
    }

    @Query('student')
    public async getStudentById(obj, args, context, info) {
        return this._usersPersistence.getUserByFilters({role: UserRole.STUDENT}, args.id);
    }

    @ResolveProperty('class')
    public async getStudentClass(obj) {
        return this._classPersistence.getById(obj.class_id);
    }

    @ResolveProperty('schedule')
    public async getStudentSchedule(obj) {
        // tslint:disable-next-line:no-console
        console.log(obj);
        return this._schedulePersistence.getScheduleTimeSlots(obj.schedule);
    }

    @Mutation('createStudent')
    public async createStudent(_, { student }) {
        // TODO perform permissions rights
        // TODO: Handle errors!!!!
        const [__, response] = await this._usersPersistence.createUser(student, UserRole.STUDENT);
        return response;
    }

    @Mutation('updateStudent')
    public async updateStudent(_, { id, student }) {
        // TODO perform permissions rights
        // TODO: Handle errors!!!!
        const [__, response] = await this._usersPersistence.updateUser(id, student, UserRole.STUDENT);
        return response;
    }

    @Mutation('deleteStudent')
    public async deleteStudent(_, { id }) {
        // TODO perform permissions rights
        // TODO: Handle errors!!!!
        const [__, response] = await this._usersPersistence.deleteUser(id);
        return response;
    }
}