import { StudentPermissionService } from './student.premission.service';
import { UsersPersistenceService } from '../persistence/users.persistence.service';
import { DBOperation, Permission } from './permission.interface';

describe('student permission service', () => {
  const MOCK_PRINCIPLE = {
    id: 'principle_1234',
    username: 'principle_ah584d',
    email: 'principle_email@test.co.il',
    firstname: 'principle_avraham',
    lastname: 'principle_hamu',
    gender: 'MALE',
    class_id: 'someclassid',
    role: 'PRINCIPLE',
  };
  const MOCK_PRINCIPLE_CONTEXT = {
    user: MOCK_PRINCIPLE,
  };

  const MOCK_TEACHER = {
    id: 'teacher_1234',
    username: 'teacher_ah584d',
    email: 'teacher_email@test.co.il',
    firstname: 'teacher_avraham',
    lastname: 'teacher_hamu',
    gender: 'MALE',
    class_id: 'someclassid',
    role: 'TEACHER',
  };
  const MOCK_TEACHER_CONTEXT = {
    user: MOCK_TEACHER,
  };

  let studentPermissionService: StudentPermissionService;
  let usersPersistence: Partial<UsersPersistenceService>;
  beforeEach(() => {
    usersPersistence = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getUsersByFilters: jest.fn(),
      getUserByFilters: jest.fn(),
      getStudentsByClassId: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      getStudentSchedule: jest.fn(),
    };

    studentPermissionService = new StudentPermissionService(usersPersistence as UsersPersistenceService);
  });

  it('should call getById function and return students on validateObjClassMatchRequester', async () => {
    (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ class_id: '123' }));

    await studentPermissionService.validateObjClassMatchRequester(
      DBOperation.READ,
      { class_id: '123' },
      MOCK_TEACHER_CONTEXT,
    );
    expect(usersPersistence.getById).toHaveBeenCalled();
  });

  it('should call getById function and throw exception on validateObjClassMatchRequester with different class_id', async () => {
    (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ class_id: '234' }));

    let err = false;
    try {
      await studentPermissionService.validateObjClassMatchRequester(
        DBOperation.READ,
        { class_id: '123' },
        MOCK_TEACHER_CONTEXT,
      );
    } catch (e) {
      err = true;
    }
    expect(usersPersistence.getById).toHaveBeenCalled();
    expect(err).toBeTruthy();
  });

  it('should call getStudentsByClassId function and return students on getAndValidateAllStudentsInClass', async () => {
    (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ class_id: '123' }));
    (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(Promise.resolve([, [{ username: 'test' }]]));

    const response = await studentPermissionService.getAndValidateAllStudentsInClass(
      DBOperation.READ,
      null,
      MOCK_TEACHER_CONTEXT,
    );
    expect(response).toEqual([Permission.OWN, [{ username: 'test' }]]);
    expect(usersPersistence.getStudentsByClassId).toHaveBeenCalled();
  });

  it('should call getAndValidateAllStudentsInClass function and return null when not permitted ', async () => {
    (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ class_id: '123' }));
    (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(Promise.resolve([, [{ username: 'test' }]]));

    const response = await studentPermissionService.getAndValidateAllStudentsInClass(
      DBOperation.UPDATE,
      null,
      MOCK_PRINCIPLE_CONTEXT,
    );

    expect(usersPersistence.getStudentsByClassId).not.toHaveBeenCalled();
    expect(response).toEqual([Permission.ALLOW, null]);
  });

  it('should call getStudentsByClassId function and throw exception on getAndValidateSingleStudentInClass with diff class_id', async () => {
    (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ class_id: '234' }));
    (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(
      Promise.resolve([, [{ _id: '101', username: 'test' }]]),
    );

    let err = false;
    try {
      const response = await studentPermissionService.getAndValidateSingleStudentInClass(
        DBOperation.READ,
        '123',
        MOCK_TEACHER_CONTEXT,
      );
    } catch (e) {
      err = true;
    }
    expect(usersPersistence.getStudentsByClassId).toHaveBeenCalled();
    expect(err).toBeTruthy();
  });

  it('should call getStudentsByClassId and return students on getAndValidateSingleStudentInClass with requested class_id', async () => {
    (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ class_id: '234' }));
    (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(
      Promise.resolve([, [{ _id: '123', username: 'test' }]]),
    );

    const response = await studentPermissionService.getAndValidateSingleStudentInClass(
      DBOperation.READ,
      '123',
      MOCK_TEACHER_CONTEXT,
    );
    expect(response).toEqual([Permission.OWN, { _id: '123', username: 'test' }]);
    expect(usersPersistence.getStudentsByClassId).toHaveBeenCalled();
  });

  it('shouldnt call getStudentsByClassId and getById, return ALLOW with no students on getAndValidateSingleStudentInClass', async () => {
    (usersPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ class_id: '234' }));
    (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(
      Promise.resolve([, [{ _id: '123', username: 'test' }]]),
    );

    const response = await studentPermissionService.getAndValidateSingleStudentInClass(
      DBOperation.READ,
      '123',
      MOCK_PRINCIPLE_CONTEXT,
    );
    expect(response).toEqual([Permission.ALLOW, null]);
    expect(usersPersistence.getStudentsByClassId).not.toHaveBeenCalled();
  });
});
