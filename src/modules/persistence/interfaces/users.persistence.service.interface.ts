'use strict';

import { UserDbModel, UserRole } from 'models/user.db.model';
import { UserLoginRequest } from 'models/user-login-request.model';

export interface IUsersPersistenceService {
  readonly getAll: () => Promise<UserDbModel[]>;
  readonly getUsersByFilters: (queyParams: { [id: string]: string }, id?: string) => Promise<UserDbModel[]>;
  readonly getUserByFilters: (queyParams: { [id: string]: string }, id?: string) => Promise<UserDbModel>;

  // CRUD on users
  readonly getById: (id: string) => Promise<UserDbModel>;
  readonly createUser: (user: UserDbModel, userRole?: UserRole) => Promise<[Error, UserDbModel]>;
  readonly updateUser: (id: string, user: UserDbModel, userRole?: UserRole) => Promise<[Error, UserDbModel]>;
  readonly updateUserPassword: (username: string, password: string) => Promise<[Error, UserDbModel]>;
  readonly deleteUser: (id: string) => Promise<[Error, number]>;

  readonly updateUserPushToken: (username: string, pushToken: string) => Promise<[Error]>;

  // Authentication
  readonly authenticateUser: ({ username, password }: UserLoginRequest) => Promise<[Error, UserDbModel]>;
  readonly getByUsername: (username: string) => Promise<[Error, UserDbModel]>;

  // Class
  readonly getStudentsByClassId: (classId: string) => Promise<[Error, UserDbModel[]]>;
}
