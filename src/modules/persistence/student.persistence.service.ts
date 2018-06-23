import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { UserDbModel, UserRole } from '../../models/user.db.model';
import { IStudentPersistenceService } from './interfaces/student.persistence.service.interface';
import { UsersPersistenceService } from './users.persistence.service';

@Injectable()
export class StudentPersistenceService  extends UsersPersistenceService implements IStudentPersistenceService {

    constructor(private _dbService: DbService) {
        super(_dbService/*, 'StudentPersistenceService'*/);
    }

    public async createStudent(student: UserDbModel): Promise<[Error, UserDbModel]> {
        try {
            student.role = UserRole.STUDENT;
            this.log(`UsersPersistenceService::createStudent:: creates student`);
            const insertResponse = await this.createUser(student);

            this.log(`UsersPersistenceService::createStudent:: inserted to DB :${JSON.stringify(insertResponse)}`);

            return insertResponse;
        } catch (error) {
            this.error(`UsersPersistenceService::createStudent:: error adding student `, error.stack);
            return [error, null];
        }
    }

    public async updateStudent(id: string, student: UserDbModel): Promise<[Error, UserDbModel]> {
        try {
            student.role = UserRole.STUDENT;
            this.log(`UsersPersistenceService::updateStudent:: updating student ${id}`);
            await this.updateUser(id, student);

            const updatedDocument = await this.getById(id);
            this.log(`UsersPersistenceService::updateStudent:: updated DB :${JSON.stringify(updatedDocument)}`);

            return [null, updatedDocument];
        } catch (error) {
            this.error(`UsersPersistenceService::updateStudent:: error updating student ${id}`, error.stack);
            return [error, null];
        }
    }

    public async deleteStudent(id: string): Promise<[Error, number]> {
        try {
            this.log(`UsersPersistenceService::deleteStudent:: deleting student by id ${id}`);
            const deleteResponse = await this.deleteUser(id);
            this.log(`UsersPersistenceService::deleteStudent:: removed ${deleteResponse[1]} documents`);
            return [null, deleteResponse[1]];
        } catch (error) {
            this.error(`UsersPersistenceService::deleteStudent:: error deleting student by id ${id}`, error.stack);
            return [error, null];
        }
    }
}