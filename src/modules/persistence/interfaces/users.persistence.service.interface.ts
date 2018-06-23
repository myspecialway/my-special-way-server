'use strict';

import { Collection } from 'mongodb';
import { UserDbModel } from 'models/user.db.model';
import { UserLoginRequest } from 'models/user-login-request.model';

export interface IUsersPersistenceService {
    readonly  collection: Collection<UserDbModel>;
    readonly getAll: () => Promise<UserDbModel[]>;
    readonly getUsersByFilters: (queyParams: { [id: string]: string }, id?: string ) => Promise<UserDbModel[]>;
    readonly getUserByFilters: (queyParams: { [id: string]: string }, id?: string ) => Promise<UserDbModel>;

    // CRUD on users
    readonly getById: (id: string) => Promise<UserDbModel>;
    readonly createUser: (user: UserDbModel) => Promise<[Error, UserDbModel]>;
    readonly updateUser: (id: string, user: UserDbModel) => Promise<[Error, UserDbModel]>;
    readonly deleteUser: (id: string) => Promise<[Error, number]>;

    // Authentication
    readonly authenticateUser: ({ username, password }: UserLoginRequest) => Promise<[Error, UserDbModel]>;
    readonly getByUsername: (username: string) => Promise<[Error, UserDbModel]>;

    // Class
    readonly getStudentsByClassId: (class_id: string) => Promise<[Error, Array<UserDbModel>]>;
}