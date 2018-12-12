import { ObjectID } from 'mongodb';
import { StudentResolver } from './student.resolver';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { UserRole } from '../../../models/user.db.model';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { Permission } from '../../permissions/permission.interface';
import { TimeSlotDbModel } from '../../../models/timeslot.db.model';
import { StudentPermissionService } from '../../permissions/student.premission.service';

describe('student resolver', () => {
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

  const MOCK_STUDENT = {
    id: 'student_1234',
    username: 'student_ah584d',
    email: 'student_email@test.co.il',
    firstname: 'student_avraham',
    lastname: 'student_hamu',
    gender: 'MALE',
    class_id: 'someclassid',
    role: 'STUDNET',
  };
  const MOCK_STUDENT_CONTEXT = {
    user: MOCK_STUDENT,
  };

  let studentResolver: StudentResolver;
  let usersPersistence: Partial<UsersPersistenceService>;
  let classPersistence: Partial<ClassPersistenceService>;
  let studentPermission: Partial<StudentPermissionService>;
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
    classPersistence = {
      getById: jest.fn(),
    };
    studentPermission = {
      validateObjClassMatchRequester: jest.fn(),
      getAndValidateSingleStudentInClass: jest.fn(),
      getAndValidateAllStudentsInClass: jest.fn(),
      getCandidateStudentForDelete: jest.fn(),
    };

    studentResolver = new StudentResolver(
      usersPersistence as UsersPersistenceService,
      classPersistence as ClassPersistenceService,
      studentPermission as StudentPermissionService,
    );
  });

  it('should call getUsersByFilters function and return students on getStudents', async () => {
    (usersPersistence.getUsersByFilters as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test' }]));
    (studentPermission.getAndValidateAllStudentsInClass as jest.Mock).mockReturnValue(
      Promise.resolve([Permission.ALLOW, null]),
    );

    const result = await studentResolver.getStudents(null, {}, MOCK_TEACHER_CONTEXT);
    expect(result).toEqual([{ username: 'test' }]);
    expect(usersPersistence.getUsersByFilters).toHaveBeenCalled();
  });

  it('should not call getUsersByFilters function and return students on getStudents', async () => {
    (usersPersistence.getUsersByFilters as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test-1' }]));
    (studentPermission.getAndValidateAllStudentsInClass as jest.Mock).mockReturnValue(
      Promise.resolve([Permission.ALLOW, [{ username: 'test-user' }]]),
    );

    const response = await studentResolver.getStudents(null, {}, MOCK_PRINCIPLE_CONTEXT);
    expect(response).toEqual([{ username: 'test-user' }]);
    expect(usersPersistence.getUsersByFilters).not.toHaveBeenCalled();
    expect(studentPermission.getAndValidateAllStudentsInClass).toHaveBeenCalled();
  });

  it('should call getUserByFilters function and return student on getStudentById', async () => {
    (usersPersistence.getUserByFilters as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test' }]));
    (studentPermission.getAndValidateSingleStudentInClass as jest.Mock).mockReturnValue(
      Promise.resolve([Permission.ALLOW, null]),
    );

    const response = await studentResolver.getStudentById(null, { id: 'someid' }, MOCK_TEACHER_CONTEXT);
    expect(response).toEqual([{ username: 'test' }]);
    expect(usersPersistence.getUserByFilters).toHaveBeenCalledWith({ role: UserRole.STUDENT }, 'someid');
  });

  it('should not getUserByFilters function and return student on getStudentById', async () => {
    (usersPersistence.getUsersByFilters as jest.Mock).mockReturnValue(Promise.resolve([{ username: 'test' }]));
    (studentPermission.getAndValidateSingleStudentInClass as jest.Mock).mockReturnValue(
      Promise.resolve([Permission.ALLOW, { username: 'test-user' }]),
    );

    const response = await studentResolver.getStudentById(null, { id: 'someid' }, MOCK_TEACHER_CONTEXT);
    expect(response).toEqual({ username: 'test-user' });
    expect(usersPersistence.getUserByFilters).not.toHaveBeenCalled();
  });

  it('should call getById function and return class on getStudentClass', async () => {
    (studentPermission.validateObjClassMatchRequester as jest.Mock).mockReturnValue(Promise.resolve(Permission.ALLOW));
    (classPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ _id: '123' }));

    const response = await studentResolver.getStudentClass({ class_id: 'someid' }, {}, MOCK_TEACHER_CONTEXT);
    expect(response).toEqual({ _id: '123' });
    expect(classPersistence.getById).toHaveBeenCalledWith('someid');
  });

  it('should call getStudentSchedule and return the merged schedule', async () => {
    const expected: TimeSlotDbModel[] = [
      { index: '00', lesson: { _id: 'someid', title: 'updatedlesson', icon: 'updatedicon' } },
      { index: '02', lesson: { _id: 'someid', title: 'somelesson', icon: 'someicon' } },
      { index: '01', lesson: { _id: 'someid', title: 'somelesson', icon: 'someicon' } },
    ];
    (usersPersistence.getStudentSchedule as jest.Mock).mockReturnValue(Promise.resolve([null, expected]));
    (studentPermission.validateObjClassMatchRequester as jest.Mock).mockReturnValue(Promise.resolve(Permission.ALLOW));
    const response = await studentResolver.getStudentSchedule({ class_id: 'someid' }, {}, MOCK_STUDENT);
    expect(response).toEqual(expected);
  });

  it('should call getStudentReminders function and return student reminders', async () => {
    const reminders = [
      {
        enabled: false,
        type: 'MEDICINE',
        schedule: [],
      },
      {
        enabled: false,
        type: 'REHAB',
        schedule: [],
      },
    ];

    usersPersistence.getStudentReminders = jest.fn().mockReturnValueOnce(Promise.resolve(reminders));

    const response = await studentResolver.getStudentReminders(MOCK_STUDENT, {}, MOCK_PRINCIPLE_CONTEXT);
    expect(usersPersistence.getStudentReminders).toHaveBeenCalledWith(MOCK_STUDENT);
    expect(response).toEqual(reminders);
  });

  it('should call createUser function and return the new student created', async () => {
    (usersPersistence.createUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_PRINCIPLE]));

    const response = await studentResolver.createStudent(null, { student: MOCK_PRINCIPLE }, MOCK_PRINCIPLE_CONTEXT);
    expect(response).toEqual(MOCK_PRINCIPLE);
    expect(usersPersistence.createUser).toHaveBeenCalledWith(MOCK_PRINCIPLE, UserRole.STUDENT);
  });

  it('should call updateUser function as principle and return the student updated', async () => {
    (usersPersistence.updateUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_PRINCIPLE]));
    (studentPermission.getAndValidateSingleStudentInClass as jest.Mock).mockReturnValue(
      Promise.resolve([Permission.ALLOW, { username: 'test-user' }]),
    );

    const response = await studentResolver.updateStudent(
      null,
      { id: 'someid', student: MOCK_PRINCIPLE },
      MOCK_PRINCIPLE_CONTEXT,
    );
    expect(response).toEqual(MOCK_PRINCIPLE);
    expect(usersPersistence.updateUser).toHaveBeenCalledWith('someid', MOCK_PRINCIPLE, UserRole.STUDENT);
  });

  it('should convert a valid class_id to ObjectID type on updateStudent', async () => {
    const studentClassId = '5be84ac53ef82c75e99d6eda';
    const inputStudent = { ...MOCK_STUDENT, class_id: studentClassId };
    const expectedStudent = { ...MOCK_STUDENT, class_id: new ObjectID(studentClassId) };

    (usersPersistence.updateUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_PRINCIPLE]));
    (studentPermission.getAndValidateSingleStudentInClass as jest.Mock).mockReturnValue(
      Promise.resolve([Permission.ALLOW, { username: 'test-user', id: MOCK_STUDENT.id }]),
    );

    const response = await studentResolver.updateStudent(
      null,
      { id: 'someid', student: inputStudent },
      MOCK_PRINCIPLE_CONTEXT,
    );

    expect(ObjectID.isValid(studentClassId)).toBeTruthy();
    expect(usersPersistence.updateUser).toHaveBeenCalledWith('someid', expectedStudent, UserRole.STUDENT);
  });

  it('should pass an invalid class_id as is on updateStudent', async () => {
    const studentClassId = '5be84ac52c75e99d6eda';
    const inputStudent = { ...MOCK_STUDENT, class_id: studentClassId };

    (usersPersistence.updateUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_PRINCIPLE]));
    (studentPermission.getAndValidateSingleStudentInClass as jest.Mock).mockReturnValue(
      Promise.resolve([Permission.ALLOW, { username: 'test-user', id: MOCK_STUDENT.id }]),
    );

    const response = await studentResolver.updateStudent(
      null,
      { id: 'someid', student: inputStudent },
      MOCK_PRINCIPLE_CONTEXT,
    );

    expect(ObjectID.isValid(studentClassId)).toBeFalsy();
    expect(usersPersistence.updateUser).toHaveBeenCalledWith('someid', inputStudent, UserRole.STUDENT);
  });

  it('should call updateUser function as teacher and return the student was not updated', async () => {
    (usersPersistence.updateUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_STUDENT]));
    (studentPermission.getAndValidateSingleStudentInClass as jest.Mock).mockReturnValue(
      Promise.resolve([Permission.OWN, null]),
    );

    const response = await studentResolver.updateStudent(
      null,
      { id: 'studentid', student: MOCK_STUDENT },
      MOCK_TEACHER_CONTEXT,
    );
    expect(response).toBeNull();
    expect(usersPersistence.updateUser).not.toHaveBeenCalled();
  });

  it('should call deleteUser function as principle and return the number of students deleted', async () => {
    (usersPersistence.deleteUser as jest.Mock).mockReturnValue(Promise.resolve([null, 1]));
    (studentPermission.getCandidateStudentForDelete as jest.Mock).mockReturnValue(
      Promise.resolve([Permission.ALLOW, { username: 'test-user' }]),
    );

    const response = await studentResolver.deleteStudent(null, { id: 'someid' }, MOCK_PRINCIPLE_CONTEXT);
    expect(response).toEqual(1);
  });

  it('should call deleteUser function as teacher and return none deleted', async () => {
    (usersPersistence.deleteUser as jest.Mock).mockReturnValue(Promise.resolve([null, null]));
    (studentPermission.getCandidateStudentForDelete as jest.Mock).mockReturnValue(
      Promise.resolve([Permission.OWN, null]),
    );

    const response = await studentResolver.deleteStudent(null, { id: 'someid' }, MOCK_PRINCIPLE_CONTEXT);
    expect(response).toBeNull();
  });
});
