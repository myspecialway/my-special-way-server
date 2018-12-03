import { DEFAULT_REMINDERS } from './../../models/reminder.db.model';
jest.mock('mongodb');
import * as common from '@nestjs/common';
import { UsersPersistenceService } from './users.persistence.service';
import { ClassPersistenceService } from './class.persistence.service';
import { SchedulePersistenceHelper } from './schedule.persistence.service';
import { DbService } from './db.service';
import { Collection, Db } from 'mongodb';
import { UserRole, UserDbModel, Gender, PasswordStatus } from '../../models/user.db.model';
import { TimeSlotDbModel } from '../../models/timeslot.db.model';
jest.mock('../../Utils/node-mailer/email.client');
import { sendemail } from '../../Utils/node-mailer/email.client';

describe('users persistence', () => {
  const collectionName = 'users';
  const mockedStudentSchedule: TimeSlotDbModel[] = [
    { index: '10', lesson: { _id: '123', title: 'english', icon: 'english' } },
  ];
  const MOCK_STUDENT: UserDbModel = {
    _id: '5b6c3a58568e78312c9e722a',
    username: 'student',
    password: 'Aa123456',
    passwordSalt: 'salt',
    email: 'msw-student@gmail.com',
    firstname: 'Msw',
    lastname: 'Student',
    role: UserRole.STUDENT,
    gender: Gender.MALE,
  };
  let usersPersistanceService: UsersPersistenceService;
  let dbServiceMock: Partial<DbService>;
  let schedulePersistenceHelper: SchedulePersistenceHelper;
  let classPersistanceService: Partial<ClassPersistenceService>;
  beforeAll(() => {
    const errorFunc = common.Logger.error.bind(common.Logger);
    common.Logger.error = (message, trace, context) => {
      errorFunc(message, '', context);
    };
  });

  beforeEach(() => {
    dbServiceMock = {
      getConnection: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn(),
          findOne: jest.fn(),
          deleteOne: jest.fn(),
          replaceOne: jest.fn(),
          findOneAndUpdate: jest.fn(),
          insertOne: jest.fn(),
          getByUsername: jest.fn(),
        } as Partial<Collection>),
      } as Partial<Db>),
    };

    schedulePersistenceHelper = {
      mergeSchedule: jest
        .fn()
        .mockReturnValue([
          { index: '00', lesson: { _id: '111', title: 'reception', icon: 'reception' } },
          { index: '10', lesson: { _id: '123', title: 'english', icon: 'english' } },
        ]),
    };

    classPersistanceService = {
      getById: jest.fn(),
    };

    usersPersistanceService = new UsersPersistenceService(
      dbServiceMock as DbService,
      classPersistanceService as ClassPersistenceService,
      schedulePersistenceHelper,
    );
  });

  it('should get all users successfuly on getAll', async () => {
    (dbServiceMock.getConnection().collection(collectionName).find as jest.Mock).mockReturnValueOnce({
      toArray: jest.fn().mockReturnValueOnce([{ username: 'user1' }, { username: 'user2' }]),
    });

    const users = await usersPersistanceService.getAll();
    expect(users).toEqual([{ username: 'user1' }, { username: 'user2' }]);
  });

  it('should throw an error on error through getAll function', async () => {
    expect.assertions(1);
    (dbServiceMock.getConnection().collection(collectionName).find as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await usersPersistanceService.getAll().catch((error) => expect(error).not.toBeUndefined());
  });

  it('should get all students successfuly on getUsersByFilters', async () => {
    (dbServiceMock.getConnection().collection(collectionName).find as jest.Mock).mockReturnValueOnce({
      toArray: jest.fn().mockReturnValueOnce([{ username: 'user1' }, { username: 'user2' }]),
    });

    const students = await usersPersistanceService.getUsersByFilters({ role: UserRole.STUDENT });
    expect(students).toEqual([{ username: 'user1' }, { username: 'user2' }]);
  });

  it('should throw an error on error through getUsersByFilters function', async () => {
    expect.assertions(1);
    (dbServiceMock.getConnection().collection(collectionName).find as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await usersPersistanceService
      .getUsersByFilters({ role: UserRole.STUDENT })
      .catch((error) => expect(error).not.toBeUndefined());
  });

  it('should get one student successfuly on getUserByFilters', async () => {
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce({
      username: 'student1',
    });

    const student = await usersPersistanceService.getUserByFilters({ role: UserRole.STUDENT }, '123467');
    expect(student).toEqual({ username: 'student1' });
  });

  it('should throw an error on error through getUserByFilters function', async () => {
    expect.assertions(1);
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await usersPersistanceService
      .getUserByFilters({ role: UserRole.STUDENT }, '123467')
      .catch((error) => expect(error).not.toBeUndefined());
  });

  it('should get user successfully on getById', async () => {
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce({
      username: 'user1',
    });

    const users = await usersPersistanceService.getById('507f1f77bcf86cd799439011');
    expect(users).toEqual({ username: 'user1' });
  });

  it('should throw an error on error through getById function', async () => {
    expect.assertions(1);
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await usersPersistanceService
      .getById('507f1f77bcf86cd799439011')
      .catch((error) => expect(error).not.toBeUndefined());
  });

  it('should call db.getConnection only once', async () => {
    expect.assertions(1);

    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce({
      username: 'user1',
    });

    await usersPersistanceService.getById('507f1f77bcf86cd799439011');
    await usersPersistanceService.getById('507f1f77bcf86cd799439011');
    await usersPersistanceService.getById('507f1f77bcf86cd799439011');
    await usersPersistanceService.getById('507f1f77bcf86cd799439011');

    // this function gets called 2 times because first time it's been called via the test itself
    // this needs to be refactored

    expect(dbServiceMock.getConnection).toHaveBeenCalledTimes(2);
  });

  it('should return user from getByUsername on success', async () => {
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce({
      username: 'user1',
    });

    const [error, user] = await usersPersistanceService.getByUsername('someUsername');

    expect(error).toBeNull();
    expect(user).toEqual({ username: 'user1' });
  });

  it('should return an error on persistance error', async () => {
    expect.hasAssertions();

    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    const [error, user] = await usersPersistanceService.getByUsername('someUsername');

    expect(error).toBeDefined();
  });

  it(`should return user and error nulls if user hasn't been found`, async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce(null);

    const [error, user] = await usersPersistanceService.getByUsername('someUsername');

    expect(error).toBeNull();
    expect(user).toBeNull();
  });

  it('should return user from authenticateUser on success', async () => {
    expect.hasAssertions();

    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce({
      username: 'user1',
    });

    const [error, user] = await usersPersistanceService.authenticateUser('someUsername');

    expect(error).toBeNull();
    expect(user).toEqual({ username: 'user1' });
  });

  it('should return an error on authenticateUser error', async () => {
    expect.hasAssertions();

    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    const [error, user] = await usersPersistanceService.authenticateUser('someUsername');

    expect(error).toBeDefined();
    expect(user).toBeNull();
  });

  it('should return an error on authenticateUser when no user found in db', async () => {
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce(null);
    const [error, user] = await usersPersistanceService.authenticateUser('someUsername');
    expect(error).toBeDefined();
    expect(user).toBeNull();
  });

  it('should remove user successfuly on deleteUser', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).deleteOne as jest.Mock).mockReturnValueOnce({
      deletedCount: 1,
    });

    const [error, removedCount] = await usersPersistanceService.deleteUser('507f1f77bcf86cd799439011');

    expect(removedCount).toBe(1);
  });

  it('should return error on deleteUser when error happened', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).deleteOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    const [error, removedCount] = await usersPersistanceService.deleteUser('507f1f77bcf86cd799439011');

    expect(error).toBeDefined();
  });

  it('should update user successfuly on updateUser', async () => {
    expect.hasAssertions();
    const expected = { username: 'newValue', someotherfied: 'somevalue' };
    (dbServiceMock.getConnection().collection(collectionName).findOneAndUpdate as jest.Mock).mockImplementation(() => {
      return { value: { username: 'newValue', someotherfied: 'somevalue' } };
    });

    const [error, updatedUser] = await usersPersistanceService.updateUser('507f1f77bcf86cd799439011', {
      username: 'newValue',
    });

    expect(updatedUser).toEqual({ username: 'newValue', someotherfied: 'somevalue' });
  });

  it('should update student successfuly on updateUser', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOneAndUpdate as jest.Mock).mockReturnValueOnce({
      value: { username: 'newValue', someotherfied: 'somevalue' },
    });

    const [error, updatedUser] = await usersPersistanceService.updateUser(
      '507f1f77bcf86cd799439011',
      { username: 'newValue' },
      UserRole.STUDENT,
    );
    expect(updatedUser).toEqual({ username: 'newValue', someotherfied: 'somevalue' });
  });

  it('should return error on updateUser when error happened', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    const [error, _] = await usersPersistanceService.updateUser('507f1f77bcf86cd799439011', {});
    expect(error).toBeDefined();
  });

  it('should update student successfuly when updating to username that taken by this user', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce({
      username: 'username',
      _id: '507f1f77bcf86cd799439011',
    });
    (dbServiceMock.getConnection().collection(collectionName).findOneAndUpdate as jest.Mock).mockReturnValueOnce({
      value: { username: 'username', someotherfied: 'somevalue' },
    });
    const [_, updatedUser] = await usersPersistanceService.updateUser('507f1f77bcf86cd799439011', {
      username: 'username',
    });
    expect(updatedUser).toEqual({ username: 'username', someotherfied: 'somevalue' });
  });

  it('should return error on updateUser when updating to taken username', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce({
      username: 'takenUsername',
      _id: '99999',
    });

    const [error, _] = await usersPersistanceService.updateUser('507f1f77bcf86cd799439011', {
      username: 'takenUsername',
    });
    expect(error).toBeDefined();
  });

  it('should create user successfuly on createUser', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ username: 'some created user' });

    (dbServiceMock.getConnection().collection(collectionName).insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });

    const [_, createdUser] = await usersPersistanceService.createUser({});

    expect(createdUser).toEqual({
      username: 'some created user',
    });
  });

  it('should create student successfuly on createUser', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ username: 'some created student' });

    (dbServiceMock.getConnection().collection(collectionName).insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });

    const [_, createdUser] = await usersPersistanceService.createUser({}, UserRole.STUDENT);

    expect(createdUser).toEqual({
      username: 'some created student',
    });
  });

  it('should return error on createUser when error happened', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    const [error, _] = await usersPersistanceService.createUser({});
    expect(error).toBeDefined();
  });

  it('should return error on createUser when username is taken', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce({
      username: 'some created student',
    });

    (dbServiceMock.getConnection().collection(collectionName).insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });

    const [error, _] = await usersPersistanceService.createUser({
      username: 'some created student',
    });

    expect(error).toBeDefined();
  });

  it('should return users with role student on getStudentsByClassId', async () => {
    const expected = [{ username: 'student1', role: 'STUDENT' }, { username: 'student2', role: 'STUDENT' }];
    (dbServiceMock.getConnection().collection(collectionName).find as jest.Mock).mockReturnValueOnce({
      toArray: jest.fn().mockReturnValueOnce(expected),
    });

    const [_, students] = await usersPersistanceService.getStudentsByClassId('507f1f77bcf86cd799439011');
    expect(students).toEqual(expected);
  });

  it('should return error on getStudentsByClassId when error happend', async () => {
    expect.assertions(1);
    (dbServiceMock.getConnection().collection(collectionName).find as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });

    await usersPersistanceService
      .getStudentsByClassId('507f1f77bcf86cd799439011')
      .catch((error) => expect(error).toBeDefined());
  });

  it('should return empty schedule on getStudentSchedule when no student schedule and no class', async () => {
    const [error, studentSchedule] = await usersPersistanceService.getStudentSchedule(MOCK_STUDENT);
    expect(studentSchedule).toEqual([]);
  });

  it('should return the student schedule on getStudentSchedule when student has no class_id', async () => {
    const mockedStudent: UserDbModel = { ...MOCK_STUDENT, schedule: mockedStudentSchedule };
    const [error, studentSchedule] = await usersPersistanceService.getStudentSchedule(mockedStudent);
    expect(studentSchedule).toEqual(mockedStudentSchedule);
  });

  it('should return the student schedule on getStudentSchedule when no class has been found in db', async () => {
    (classPersistanceService.getById as jest.Mock).mockReturnValueOnce(null);
    const mockedStudent: UserDbModel = { ...MOCK_STUDENT, schedule: mockedStudentSchedule, class_id: 'someclassid' };
    const [error, studentSchedule] = await usersPersistanceService.getStudentSchedule(mockedStudent);
    expect(studentSchedule).toEqual(mockedStudentSchedule);
  });

  it("should return the student schedule on getStudentSchedule when user has class but there's no schedule", async () => {
    (classPersistanceService.getById as jest.Mock).mockReturnValueOnce({ _id: 'someclassid' });
    const mockedStudent: UserDbModel = { ...MOCK_STUDENT, schedule: mockedStudentSchedule, class_id: 'someclassid' };
    const [error, studentSchedule] = await usersPersistanceService.getStudentSchedule(mockedStudent);
    expect(studentSchedule).toEqual(mockedStudentSchedule);
  });

  it("should return merged schedule on getStudentSchedule when there's student + class schedules", async () => {
    const mockedStudent: UserDbModel = { ...MOCK_STUDENT, schedule: mockedStudentSchedule, class_id: 'someclassid' };
    (classPersistanceService.getById as jest.Mock).mockReturnValueOnce({
      _id: 'someclassid',
      schedule: [
        { index: '00', lesson: { _id: '111', title: 'reception', icon: 'reception' } },
        { index: '10', lesson: { _id: '456', title: 'art', icon: 'art' } },
      ],
    });
    const expected = [
      { index: '00', lesson: { _id: '111', title: 'reception', icon: 'reception' } },
      { index: '10', lesson: { _id: '123', title: 'english', icon: 'english' } },
    ];
    const [error, studentSchedule] = await usersPersistanceService.getStudentSchedule(mockedStudent);
    expect(studentSchedule).toEqual(expected);
  });

  it('should return error on getStudentSchedule when error happens', async () => {
    expect.assertions(1);
    const mockedStudent: UserDbModel = { ...MOCK_STUDENT, schedule: mockedStudentSchedule, class_id: 'someclassid' };
    (classPersistanceService.getById as jest.Mock).mockImplementationOnce(() => {
      throw new Error('mock error');
    });
    await usersPersistanceService.getStudentSchedule(mockedStudent).catch((error) => {
      expect(error).toBeDefined();
    });
  });

  it('should create user with passwordStatus NO_SET and first login token on createUser principle', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ username: 'some created user' });

    (dbServiceMock.getConnection().collection(collectionName).insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });

    await usersPersistanceService.createUser({ username: 'someUsername' }, UserRole.PRINCIPLE);
    expect(dbServiceMock.getConnection().collection(collectionName).insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        passwordStatus: PasswordStatus.NOT_SET,
        firstLoginData: expect.objectContaining({ token: expect.any(String), expiration: expect.any(Date) }),
      }),
    );
  });
  it('should create user with passwordStatus VALID and password not null on createUser student', async () => {
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ username: 'some created user' });

    (dbServiceMock.getConnection().collection(collectionName).insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });
    await usersPersistanceService.createUser(
      { _id: 'id', password: '12345', username: 'someUsername' },
      UserRole.STUDENT,
    );
    expect(dbServiceMock.getConnection().collection(collectionName).insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        passwordStatus: PasswordStatus.VALID,
        password: expect.any(String),
      }),
    );
  });

  it('should remove firstLoginToken successfuly on updateUser', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({
        passwordStatus: PasswordStatus.NOT_SET,
        password: undefined,
        firstLoginData: {},
      });

    (dbServiceMock.getConnection().collection(collectionName).findOneAndUpdate as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });

    await usersPersistanceService.updateUserPassword('507f1f77bcf86cd799439011', '123456');
    expect(dbServiceMock.getConnection().collection(collectionName).findOneAndUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        $set: { password: '123456', passwordStatus: PasswordStatus.VALID, firstLoginData: undefined },
      }),
      expect.anything(),
    );
  });

  it('should return error on updateUser failed because no user found', async () => {
    expect.hasAssertions();

    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce(() => {
      throw new Error('mock error');
    });
    const [error, updatedUser] = await usersPersistanceService.updateUserPassword('507f1f77bcf86cd799439011', '123456');
    expect(error).toBeDefined();
  });

  it('should return error on updateUser failed ', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock).mockReturnValueOnce({
      passwordStatus: PasswordStatus.NOT_SET,
      password: undefined,
      firstLoginData: {},
    });

    (dbServiceMock.getConnection().collection(collectionName).findOneAndUpdate as jest.Mock).mockReturnValueOnce(() => {
      throw new Error('mock error');
    });
    const [error, updatedUser] = await usersPersistanceService.updateUserPassword('507f1f77bcf86cd799439011', '123456');
    expect(error).toBeDefined();
  });

  it('should return default reminders when missing on getStudentReminders', () => {
    const res = usersPersistanceService.getStudentReminders(MOCK_STUDENT);
    const expected = DEFAULT_REMINDERS;

    expect(res).toEqual(expected);
  });

  it('should return same student reminders when existing on getStudentReminders', () => {
    const res = usersPersistanceService.getStudentReminders({ ...MOCK_STUDENT, reminders: [] });
    const expected = [];

    expect(res).toEqual(expected);
  });
  it('should write on log when send mail fails', async () => {
    expect.hasAssertions();
    (dbServiceMock.getConnection().collection(collectionName).findOne as jest.Mock)
      .mockReturnValueOnce({})
      .mockReturnValueOnce({ username: 'some created user' });

    (dbServiceMock.getConnection().collection(collectionName).insertOne as jest.Mock).mockReturnValueOnce({
      insertedId: '507f1f77bcf86cd799439011',
    });
    (sendemail as jest.Mock).mockReturnValue(false);
    common.Logger.error = jest.fn();
    (common.Logger.error as jest.Mock).mockImplementation((message, trace, context) => {
      expect(message).toBe('Failed to send email');
    });
    await usersPersistanceService.createUser({ username: 'someUsername' }, UserRole.PRINCIPLE);
    expect(common.Logger.error).toHaveBeenCalled();
  });
});
