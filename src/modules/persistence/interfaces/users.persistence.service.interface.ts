'use strict';

import { Collection } from 'mongodb';
import { UserDbModel } from 'models/user.db.model';
import { UserLoginRequest } from 'models/user-login-request.model';

export interface IUsersPersistenceService {
    readonly collection: Collection<UserDbModel>;
    readonly getAll: () => Promise<UserDbModel[]>;
    readonly getById: (id: string) => Promise<UserDbModel>;
    readonly createUser: (user: UserDbModel) => Promise<[Error, UserDbModel]>;
    readonly updateUser: (id: string, user: UserDbModel) => Promise<[Error, UserDbModel]>;
    readonly deleteUser: (id: string) => Promise<[Error, number]>;
    readonly authenticateUser: ({ username, password }: UserLoginRequest) => Promise<[Error, UserDbModel]>;
    readonly getByUsername: (username: string) => Promise<[Error, UserDbModel]>;
}