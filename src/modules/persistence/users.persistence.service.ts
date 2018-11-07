import { Injectable, Logger } from '@nestjs/common';
import { DbService } from './db.service';
import { Collection, ObjectID } from 'mongodb';
import { UserDbModel, UserRole } from 'models/user.db.model';
import { UserLoginRequest } from 'models/user-login-request.model';
import { ClassPersistenceService } from './class.persistence.service';
import { SchedulePersistenceService } from './schedule.persistence.service';
import { IUsersPersistenceService } from './interfaces/users.persistence.service.interface';
import { TimeSlotDbModel } from 'models/timeslot.db.model';
import { UserUniqueValidationRequest } from 'models/user-unique-validation-request.model';

@Injectable()
export class UsersPersistenceService implements IUsersPersistenceService {
  private collection: Collection<UserDbModel>;
  private logger = new Logger('UsersPersistenceService');

  constructor(
    private dbService: DbService,
    private classPersistenceService: ClassPersistenceService,
    private schedulePersistenceService: SchedulePersistenceService,
  ) {
    const db = this.dbService.getConnection();
    this.collection = db.collection<UserDbModel>('users');
  }

  private buildMongoFilterFromQuery(query: { [id: string]: any }, id?: string): { [id: string]: string } {
    if (id) {
      const mongoId = new ObjectID(id);
      query._id = mongoId;
    }
    return query;
  }

  async getAll(): Promise<UserDbModel[]> {
    try {
      this.logger.log('getAll:: fetching users');
      return await this.collection.find({}).toArray();
    } catch (error) {
      this.logger.error('getAll:: error fetching users', error.stack);
      throw error;
    }
  }

  async getUsersByFilters(queyParams: { [id: string]: string }): Promise<UserDbModel[]> {
    try {
      const mongoQuery = this.buildMongoFilterFromQuery(queyParams);

      this.logger.log(`getUsersByFilters:: fetching users by parameters `);
      return await this.collection.find(mongoQuery).toArray();
    } catch (error) {
      this.logger.error(`getUsersByFilters:: error fetching user by parameters`, error.stack);
      throw error;
    }
  }

  async getUserByFilters(queyParams: { [id: string]: string }, id?: string): Promise<UserDbModel> {
    try {
      const mongoQuery = this.buildMongoFilterFromQuery(queyParams, id);

      this.logger.log(`getUsersByFilters:: fetching users by parameters `);
      return await this.collection.findOne(mongoQuery);
    } catch (error) {
      this.logger.error(`getUsersByFilters:: error fetching user by parameters`, error.stack);
      throw error;
    }
  }

  // CRUD on users
  async getById(id: string): Promise<UserDbModel> {
    try {
      const mongoId = new ObjectID(id);
      this.logger.log(`getAll:: fetching user by id ${id}`);
      return await this.collection.findOne({ _id: mongoId });
    } catch (error) {
      this.logger.error(`getAll:: error fetching user by id ${id}`, error.stack);
      throw error;
    }
  }

  async createUser(user: UserDbModel, userRole?: UserRole): Promise<[Error, UserDbModel]> {
    try {
      this.logger.log(`createUser:: creates user with username ${user.username}`);
      if (userRole) {
        user.role = userRole;
      }
      if (!user.password) {
        this.logger.error(
          '***********************Temporary fix - default password Aa123456 is temporary until we implement ' +
            'initial login user story ****************************************',
        );
        user.password = 'Aa123456';
      }
      const [error, isUnique] = await this.validateUserNameUnique({
        username: user.username,
      } as UserUniqueValidationRequest);
      if (error) {
        throw error;
      }
      if (!isUnique) {
        this.logger.error(`createUser:: error adding user - username ${user.username} is taken`);
        return [new Error(`createUser:: error adding user - username ${user.username} is taken`), null];
      }
      const insertResponse = await this.collection.insertOne(user);
      const newDocument = await this.getById(insertResponse.insertedId.toString());
      this.logger.log(`createUser:: inserted user to DB with id: ${newDocument._id}`);

      return [null, newDocument];
    } catch (error) {
      this.logger.error(`createUser:: error adding user `, error.stack);
      return [error, null];
    }
  }

  async updateUser(id: string, user: UserDbModel, userRole?: UserRole): Promise<[Error, UserDbModel]> {
    if (userRole) {
      user.role = userRole;
    }

    const mongoId = new ObjectID(id);
    try {
      const [error, isUnique] = await this.validateUserNameUnique({
        username: user.username,
        id,
      } as UserUniqueValidationRequest);
      if (error) {
        throw error;
      }
      if (!isUnique) {
        this.logger.error(`updateUser:: error update user - username ${user.username} is taken`);
        return [new Error(`updateUser:: error update user - username ${user.username} is taken`), null];
      }
      this.logger.log(`updateUser:: updating user ${mongoId}`);

      const updatedDocument = await this.collection.findOneAndUpdate(
        { _id: mongoId },
        { $set: user },
        { returnOriginal: false },
      );
      this.logger.log(`updateUser:: updated DB :${JSON.stringify(updatedDocument.value)}`);
      return [null, updatedDocument.value];
    } catch (error) {
      this.logger.error(`updateUser:: error updating user ${mongoId}`, error.stack);
      return [error, null];
    }
  }

  async deleteUser(id: string): Promise<[Error, number]> {
    try {
      const mongoId = new ObjectID(id);
      this.logger.log(`deleteUser:: deleting user by id ${id}`);
      const deleteResponse = await this.collection.deleteOne({ _id: mongoId });
      this.logger.log(`deleteUser:: removed ${deleteResponse.deletedCount} documents`);
      return [null, deleteResponse.deletedCount];
    } catch (error) {
      this.logger.error(`deleteUser:: error deleting user by id ${id}`, error.stack);
      return [error, null];
    }
  }

  // Authentication
  // TODO move into a specific service
  async authenticateUser({ username, password }: UserLoginRequest): Promise<[Error, UserDbModel]> {
    try {
      this.logger.log(`authenticateUser:: authenticating user ${username}`);
      const user = await this.collection.findOne({ username, password });
      if (!user) {
        this.logger.warn(`authenticateUser:: user ${username} not found in db`);
        throw new Error(`authenticateUser:: user ${username} not found in db`);
      }

      return [null, user];
    } catch (error) {
      this.logger.error(`authenticateUser:: error authenticating user ${username}`, error.stack);
      return [error, null];
    }
  }

  async getByUsername(username: string): Promise<[Error, UserDbModel]> {
    try {
      this.logger.log(`getByUsername:: fetching user by username ${username}`);
      return [null, await this.collection.findOne({ username })];
    } catch (error) {
      this.logger.error(`getAll:: error fetching user by username ${username}`, error.stack);
      return [error, null];
    }
  }

  // Class
  // TODO move into class service
  async getStudentsByClassId(classId: string): Promise<[Error, UserDbModel[]]> {
    try {
      this.logger.log(`getStudentsByClassId:: fetching students by class id ${classId}`);
      const res = await this.collection.find({ class_id: new ObjectID(classId), role: 'STUDENT' }).toArray();
      return [null, res];
    } catch (error) {
      this.logger.error(`getStudentsByClassId:: error fetching students by class id ${classId}`, error.stack);
      throw [error, null];
    }
  }

  async getStudentSchedule(student: UserDbModel): Promise<[Error, TimeSlotDbModel[]]> {
    try {
      if (!student.schedule) {
        student.schedule = [];
      }
      if (!student.class_id) {
        return [null, student.schedule];
      }
      this.logger.log(`getStudentSchedule:: fetching student-${student.schedule} class schedule`);
      const studentClass = await this.classPersistenceService.getById(student.class_id);
      if (!studentClass || !studentClass.schedule) {
        return [null, student.schedule];
      }
      return [null, this.schedulePersistenceService.mergeSchedule(studentClass.schedule, student.schedule, 'index')];
    } catch (error) {
      this.logger.error(`getStudentSchedule:: error fetching student schedule`, error.stack);
      throw [error, null];
    }
  }

  async validateUserNameUnique(userUniqueValidation: UserUniqueValidationRequest): Promise<[Error, boolean]> {
    const [error, user] = await this.getByUsername(userUniqueValidation.username);
    if (error) {
      this.logger.error(`validateUserNameUnique:: error validating user ${userUniqueValidation.username}`, error.stack);
      return [error, null];
    }

    // User not found => Username is unique
    if (!user || !user.username) {
      return [null, true];
    }

    // Validate the 'edit user' form
    if (userUniqueValidation.id) {
      if (userUniqueValidation.id === user._id.toString()) {
        // Current user found => Username is unique
        return [null, true];
      } else {
        // Another user found => Username isn't unique
        return [null, false];
      }
      // Validate the 'create user' form
    } else {
      return [null, false];
    }
  }
}
