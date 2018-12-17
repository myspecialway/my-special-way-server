import { ObjectID } from 'mongodb';
import { StudentResolver } from './student.resolver';
import { ClassPersistenceService } from '../../persistence/class.persistence.service';
import { UserRole } from '../../../models/user.db.model';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { Permission } from '../../permissions/permission.interface';
import { TimeSlotDbModel } from '../../../models/timeslot.db.model';
import { StudentPermissionService } from '../../permissions/student.premission.service';
import { FCMSender } from '../../../utils/FCMSender/FCMSender';
import { NonActiveTimePersistenceService } from '../../persistence/non-active-time.persistence.service';

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
  let fcmsSender: Partial<FCMSender>;
  let nonActiveTimePersistence: Partial<NonActiveTimePersistenceService>;

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
      getByUsername: jest.fn(),
      getFcmToken4User: jest.fn(),
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
    nonActiveTimePersistence = {
      getAll: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };
    fcmsSender = {
      sendTxtMsgToAndroid: jest.fn(),
      sendDataMsgToAndroid: jest.fn(),
    };
    studentResolver = new StudentResolver(
      usersPersistence as UsersPersistenceService,
      classPersistence as ClassPersistenceService,
      nonActiveTimePersistence as NonActiveTimePersistenceService,
      studentPermission as StudentPermissionService,
      fcmsSender,
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
      { index: '00', hours: '123', lesson: { _id: 'someid', title: 'updatedlesson', icon: 'updatedicon' } },
      { index: '02', hours: '456', lesson: { _id: 'someid', title: 'somelesson', icon: 'someicon' } },
      { index: '01', hours: '789', lesson: { _id: 'someid', title: 'somelesson', icon: 'someicon' } },
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

  it('should call createUser function and return the new students that were created', async () => {
    (usersPersistence.createUser as jest.Mock)
      .mockReturnValueOnce(Promise.resolve([null, MOCK_PRINCIPLE]))
      .mockReturnValueOnce(Promise.resolve([null, MOCK_STUDENT]));

    const response = await studentResolver.createStudents(
      null,
      { students: [MOCK_PRINCIPLE, MOCK_STUDENT] },
      MOCK_PRINCIPLE_CONTEXT,
    );
    expect(response).toEqual([MOCK_PRINCIPLE, MOCK_STUDENT]);
    expect(usersPersistence.createUser).toHaveBeenCalledTimes(2);
    expect(usersPersistence.createUser).toHaveBeenCalledWith(MOCK_PRINCIPLE, UserRole.STUDENT);
    expect(usersPersistence.createUser).toHaveBeenCalledWith(MOCK_STUDENT, UserRole.STUDENT);
  });

  it('should call createUser function with class_id as object', async () => {
    const studentMock = Object.assign(MOCK_STUDENT, { class_id: '5bfcf4b8b8a8413fb484a867' });
    (usersPersistence.createUser as jest.Mock).mockReturnValue(Promise.resolve([null, studentMock]));

    const response = await studentResolver.createStudent(null, { student: studentMock }, MOCK_PRINCIPLE_CONTEXT);
    expect(response.class_id).toEqual(new ObjectID(studentMock.class_id));
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

  it('should try to send push message when updating a user', async () => {
    (usersPersistence.getFcmToken4User as jest.Mock).mockReturnValue(Promise.resolve('any-token'));
    (usersPersistence.updateUser as jest.Mock).mockReturnValue(Promise.resolve([null, MOCK_TEACHER]));
    (studentPermission.getAndValidateSingleStudentInClass as jest.Mock).mockReturnValue(
      Promise.resolve([Permission.OWN, MOCK_STUDENT]),
    );

    const response = await studentResolver.updateStudent(
      null,
      { id: 'studentid', student: MOCK_STUDENT },
      MOCK_TEACHER_CONTEXT,
    );
    expect(fcmsSender.sendDataMsgToAndroid).toHaveBeenCalled();
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

  it('should call getNonActiveTimes function and return the nonActiveTIme object', async () => {
    const mockNonActiveTime = [
      {
        _id: 'ID',
        title: 'title',
        isAllDayEvent: true,
        startDateTime: 'start',
        endDateTime: 'end',
        isAllClassesEvent: true,
      },
    ];
    const mockUser = { class_id: 'ID' };

    (nonActiveTimePersistence.getAll as jest.Mock).mockReturnValueOnce(Promise.resolve(mockNonActiveTime));

    const response = await studentResolver.getNonActiveTimes(mockUser, {}, MOCK_PRINCIPLE_CONTEXT);
    expect(response).toEqual(mockNonActiveTime);
    expect(nonActiveTimePersistence.getAll).toHaveBeenCalledWith();
  });

  it('should call getNonActiveTimes function and return the empty array when no times are relevant', async () => {
    const mockNonActiveTime = [
      {
        _id: 'ID',
        title: 'title',
        isAllDayEvent: true,
        startDateTime: 'start',
        endDateTime: 'end',
        isAllClassesEvent: false,
        classesIds: [],
      },
    ];
    const mockUser = { class_id: 'ID' };

    (nonActiveTimePersistence.getAll as jest.Mock).mockReturnValueOnce(Promise.resolve(mockNonActiveTime));

    const response = await studentResolver.getNonActiveTimes(mockUser, {}, MOCK_PRINCIPLE_CONTEXT);
    expect(response).toEqual([]);
    expect(nonActiveTimePersistence.getAll).toHaveBeenCalledWith();
  });
});
