import { ObjectID } from 'mongodb';
import { ClassDbModel } from '../../../models/class.db.model';
import { UsersPersistenceService } from './../../persistence/users.persistence.service';
import { UsersResolver } from './users.resolver';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';

describe('user resolver', () => {
  const MOCK_USER = {
    username: 'test_username',
    email: 'email@test.co.il',
    firstname: 'test_firstname',
    lastname: 'test_lastname',
    role: 'PRINCIPLE',
  };
  const MOCK_CONTEXT = {
    user: MOCK_USER,
  };
  let usersResolver: UsersResolver;
  let userPersistence: Partial<UsersPersistenceService>;
  let classPersistenceService: Partial<ClassPersistenceService>;
  beforeEach(() => {
    userPersistence = {
      getAll: jest.fn(),
      getById: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    classPersistenceService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByName: jest.fn(),
      createClass: jest.fn(),
      updateClass: jest.fn(),
      deleteClass: jest.fn(),
    };

    usersResolver = new UsersResolver(
      userPersistence as UsersPersistenceService,
      classPersistenceService as ClassPersistenceService,
    );
  });

  it('should call getAll function and return users for on getUsers', async () => {
    (userPersistence.getAll as jest.Mock).mockReturnValue(
      Promise.resolve([{ username: 'test' }]),
    );

    const response = await usersResolver.getUsers(null, {}, MOCK_CONTEXT);
    expect(response).toEqual([{ username: 'test' }]);
    expect(userPersistence.getAll).toHaveBeenCalled();
  });

  it('should call getById function and return user on getUserById', async () => {
    (userPersistence.getById as jest.Mock).mockReturnValue(
      Promise.resolve({ username: 'test' }),
    );

    const response = await usersResolver.getUserById(
      null,
      { id: 'someid' },
      MOCK_CONTEXT,
      null,
    );
    expect(response).toEqual({ username: 'test' });
    expect(userPersistence.getById).toHaveBeenCalledWith('someid');
  });

  it('should call createUser function and return the new user created', async () => {
    (userPersistence.createUser as jest.Mock).mockReturnValue(
      Promise.resolve([null, MOCK_USER]),
    );

    const response = await usersResolver.createUser(
      null,
      { user: MOCK_USER },
      MOCK_CONTEXT,
    );
    expect(response).toEqual(MOCK_USER);
    expect(userPersistence.createUser).toHaveBeenCalledWith(MOCK_USER);
  });

  it('should call createUser with class and get the new user with class_id', async () => {
    const testClass: ClassDbModel = {
      _id: '5b9e6ef0312c81ddc4325b89',
      name: 'classname',
      grade: 'somegrade',
    };

    const userWithClass = { ...MOCK_USER, class_id: testClass._id };
    const userWithClassId = { ...MOCK_USER, class_id: new ObjectID(testClass._id) };

    userPersistence.createUser = jest.fn((user) => Promise.resolve([null, user]));

    const response = await usersResolver.createUser(
      null,
      { user: userWithClass },
      MOCK_CONTEXT,
    );
    // expect(response).toEqual(userWithClass);
    // expect(userPersistence.createUser).toHaveBeenCalledWith(userWithClass);
    expect(response).toEqual(userWithClassId);
  });

  it('should call updateUser function and return the user updated', async () => {
    (userPersistence.updateUser as jest.Mock).mockReturnValue(
      Promise.resolve([null, MOCK_USER]),
    );

    const response = await usersResolver.updateUser(
      null,
      { id: 'someid', user: MOCK_USER },
      MOCK_CONTEXT,
    );
    expect(response).toEqual(MOCK_USER);
    expect(userPersistence.updateUser).toHaveBeenCalledWith(
      'someid',
      MOCK_USER,
    );
  });

  it('should call deleteUser function and return the number of user deleted', async () => {
    (userPersistence.deleteUser as jest.Mock).mockReturnValue(
      Promise.resolve([null, 1]),
    );

    const response = await usersResolver.deleteUser(
      null,
      { id: 'someid' },
      MOCK_CONTEXT,
    );
    expect(response).toEqual(1);
    expect(userPersistence.deleteUser).toHaveBeenCalledWith('someid');
  });

  it('should call getUserClass function and return the class object', async () => {
    const classId = '507f1f77bcf86cd799439011';
    const mockObj = { class_id: classId };
    const mockClass = { name: 'myClassName' };

    (classPersistenceService.getById as jest.Mock).mockReturnValueOnce(
      Promise.resolve(mockClass),
    );

    const response = await usersResolver.getUserClass(
      mockObj,
      {},
      MOCK_CONTEXT,
    );
    expect(response).toEqual(mockClass);
    expect(classPersistenceService.getById).toHaveBeenCalledWith(classId);
  });
});
