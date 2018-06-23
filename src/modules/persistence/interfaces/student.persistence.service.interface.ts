'use strict';

import { UserDbModel } from 'models/user.db.model';

export interface IStudentPersistenceService {
    // CRUD on students
    readonly createStudent: (user: UserDbModel) => Promise<[Error, UserDbModel]>;
    readonly updateStudent: (id: string, user: UserDbModel) => Promise<[Error, UserDbModel]>;
    readonly deleteStudent: (id: string) => Promise<[Error, number]>;
}