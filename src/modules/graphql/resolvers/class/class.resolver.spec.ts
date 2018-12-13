import { ClassResolver } from './class.resolver';
import { ClassLogic } from './services/class-logic.service';
import { ClassPersistenceService } from '../../../persistence/class.persistence.service';
import { UsersPersistenceService } from '../../../persistence/users.persistence.service';
import { Permission } from '../../../permissions/permission.interface';
import { ClassPermissionService } from '../../../permissions/class.permission.service';
import { UserDbModel } from '../../../../models/user.db.model';
import { LessonPersistenceService } from '../../../persistence/lesson.persistence.service';

describe('class resolver', () => {
  const MOCK_PRINCIPLE = {
    id: 'test_principle_id',
    username: 'test_username',
    email: 'email@test.co.il',
    firstname: 'test_firstname',
    lastname: 'test_lastname',
    class_id: 'test_classid',
    role: 'PRINCIPLE',
  };
  const MOCK_PRINCIPLE_CONTEXT = {
    user: MOCK_PRINCIPLE,
  };

  const MOCK_TEACHER = {
    id: 'test_teahcer_id',
    username: 'test_username',
    email: 'email@test.co.il',
    firstname: 'test_firstname',
    lastname: 'test_lastname',
    class_id: 'test_classid',
    role: 'TEACHER',
  };
  const MOCK_TEACHER_CONTEXT = {
    user: MOCK_TEACHER,
  };

  let classResolver: ClassResolver;
  let classPersistence: Partial<ClassPersistenceService>;
  let usersPersistence: Partial<UsersPersistenceService>;
  let classPermissionService: Partial<ClassPermissionService>;
  let lessonPersistence: Partial<LessonPersistenceService>;
  let classLogic: Partial<ClassLogic>;
  beforeEach(() => {
    classPersistence = {
      getAll: jest.fn(),
      getById: jest.fn(),
      getByName: jest.fn(),
      createClass: jest.fn(),
      updateClass: jest.fn(),
      deleteClass: jest.fn(),
    };
    lessonPersistence = {
      getAll: jest.fn(),
    };
    usersPersistence = {
      getStudentsByClassId: jest.fn(),
      getById: jest.fn(),
    };
    classPermissionService = {
      validateObjClassMatchRequester: jest.fn(),
      getAndValidateClassOfRequster: jest.fn(),
    };

    classLogic = {
      buildDefaultSchedule: jest.fn().mockReturnValue([null, []]),
      fixLessonIds: jest.fn(),
    };

    classResolver = new ClassResolver(
      classPersistence as ClassPersistenceService,
      usersPersistence as UsersPersistenceService,
      classPermissionService as ClassPermissionService,
      classLogic as ClassLogic,
      lessonPersistence as LessonPersistenceService,
    );
  });

  it('should call getAll function and return classes for on classes', async () => {
    (classPersistence.getAll as jest.Mock).mockReturnValue(Promise.resolve([{ name: 'test' }]));

    const response = await classResolver.getClasses(null, null, MOCK_PRINCIPLE_CONTEXT, null);
    expect(response).toEqual([{ name: 'test' }]);
    expect(classPersistence.getAll).toHaveBeenCalled();
  });

  it('should call getAll and getById function and return classes for on classes', async () => {
    (classPersistence.getAll as jest.Mock).mockReturnValue(
      Promise.resolve([{ name: 'test_class_name', _id: 'test_classid' }]),
    );
    (usersPersistence.getById as jest.Mock).mockReturnValue(
      Promise.resolve({ name: 'test', _id: 'someid', class_id: 'test_classid' }),
    );

    const response = await classResolver.getClasses(null, null, MOCK_TEACHER_CONTEXT, null);
    expect(response).toEqual([{ name: 'test_class_name', _id: 'test_classid' }]);
    expect(usersPersistence.getById).toHaveBeenCalled();
    expect(classPersistence.getAll).toHaveBeenCalled();
  });

  it('should call getById function and return class on getClassById', async () => {
    (classPersistence.getById as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test' }));
    (classPermissionService.getAndValidateClassOfRequster as jest.Mock).mockReturnValue(
      Promise.resolve({ name: 'test' }),
    );

    const response = await classResolver.getClassById(null, { id: 'someid' }, MOCK_PRINCIPLE_CONTEXT, null);
    expect(response).toEqual({ name: 'test' });
    expect(classPersistence.getById).toHaveBeenCalledWith('someid');
  });

  it('should call getByName function and return class on getClassByName', async () => {
    (classPersistence.getByName as jest.Mock).mockReturnValue(Promise.resolve({ name: 'test' }));
    (classPermissionService.getAndValidateClassOfRequster as jest.Mock).mockReturnValue(
      Promise.resolve({ name: 'test' }),
    );

    const response = await classResolver.getClassByName(null, { name: 'somename' }, MOCK_PRINCIPLE_CONTEXT, null);
    expect(classPersistence.getByName).toHaveBeenCalledWith('somename');
  });
  it('should call getClassSchedule and return the obj schedule 1', async () => {
    (lessonPersistence.getAll as jest.Mock).mockReturnValue(
      Promise.resolve([{ _id: 'anyid', title: 'anytitle', icon: 'anyIcon' }]),
    );

    const schedule = await classResolver.getClassSchedule(
      {
        name: 'someclass',
        schedule: [{ index: '00', lesson: { _id: 'anyid', title: 'anytitle', icon: 'anyIcon' } }],
      },
      {},
      MOCK_PRINCIPLE_CONTEXT,
    );

    expect(schedule[0].lesson._id).toEqual('anyid');
  });
  it('should call getClassSchedule and return the obj schedule', async () => {
    const schedule = await classResolver.getClassSchedule(
      { name: 'someclass', schedule: [{ index: '00' }] },
      {},
      MOCK_PRINCIPLE_CONTEXT,
    );
    expect(schedule[0]).toEqual({ index: '00' });
  });

  it("should call getClassSchedule and return empty array when there's no schedule - empty array", async () => {
    const schedule = await classResolver.getClassSchedule(
      { name: 'someclass', schedule: [] },
      {},
      MOCK_PRINCIPLE_CONTEXT,
    );
    expect(schedule).toHaveLength(0);
  });

  it("should call getClassSchedule and return empty array when there's no schedule - empty object", async () => {
    const schedule = await classResolver.getClassSchedule(
      { name: 'someclass', schedule: {} },
      {},
      MOCK_PRINCIPLE_CONTEXT,
    );
    expect(schedule).toHaveLength(0);
  });
  it("should call getClassSchedule and return empty array when there's no schedule - undefined", async () => {
    const schedule = await classResolver.getClassSchedule({ name: 'someclass' }, {}, MOCK_PRINCIPLE_CONTEXT);
    expect(schedule).toHaveLength(0);
  });

  it('should call getStudentsByClassId and return 0 students', async () => {
    (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(Promise.resolve([null, [MOCK_TEACHER]]));
    const response = await classResolver.getStudentsByClassId({ _id: 'someclass' }, {}, MOCK_PRINCIPLE_CONTEXT);
    expect(response).toEqual([MOCK_TEACHER]);
  });

  it('should call getStudentsByClassId and throw error', async () => {
    (usersPersistence.getStudentsByClassId as jest.Mock).mockReturnValue(Promise.resolve(['err', [MOCK_TEACHER]]));
    let err: boolean = false;
    try {
      const response = await classResolver.getStudentsByClassId({ _id: 'someclass' }, {}, MOCK_PRINCIPLE_CONTEXT);
    } catch (e) {
      err = true;
    }
    expect(err).toBeTruthy();
  });

  it('should call createClass and return new created class', async () => {
    const expected = { name: 'טיטאן', level: 'א', number: 1, grade: 'a' };
    (classPersistence.createClass as jest.Mock).mockReturnValue(Promise.resolve(expected));
    const response = await classResolver.createClass(null, { class: expected }, MOCK_PRINCIPLE_CONTEXT);
    expect(response).toEqual(expected);
    expect(classPersistence.createClass).toHaveBeenCalledWith(expected);
  });

  it('should return error if wrong grade was received', async () => {
    const classLogicMock = classLogic.buildDefaultSchedule as jest.Mock;
    classLogicMock.mockReset();
    classLogicMock.mockReturnValue([new Error(), []]);

    const newClassMock = { name: 'טיטאן', level: 'א', number: 1, grade: 'a' };
    const response = await classResolver.createClass(null, { class: newClassMock }, MOCK_PRINCIPLE_CONTEXT);
    expect(response).toEqual(new Error());
  });

  it('should call updateClass and return updated class', async () => {
    const expected = { name: 'טיטאן', level: 'א', number: 1 };
    (classPersistence.updateClass as jest.Mock).mockReturnValue(Promise.resolve(expected));
    (classPermissionService.validateObjClassMatchRequester as jest.Mock).mockReturnValue(
      Promise.resolve(Permission.ALLOW),
    );

    const result = await classResolver.updateClass(
      null,
      { id: '5b217b030825622c97d3757f', class: expected },
      MOCK_PRINCIPLE_CONTEXT,
    );
    expect(result).toEqual(expected);
    expect(classPersistence.updateClass).toHaveBeenLastCalledWith('5b217b030825622c97d3757f', expected);
  });

  it('should call updateClass and throw error for non authorized teacher', async () => {
    const expected = { name: 'טיטאן', level: 'א', number: 1 };
    (classPersistence.updateClass as jest.Mock).mockReturnValue(Promise.resolve(expected));
    (classPermissionService.validateObjClassMatchRequester as jest.Mock).mockReturnValue(
      Promise.resolve(Permission.FORBID),
    );

    let err: boolean = false;
    try {
      const result = await classResolver.updateClass(
        null,
        { id: 'test_classid', class: expected },
        MOCK_TEACHER_CONTEXT,
      );
    } catch (e) {
      err = true;
    }
    expect(err).toBeTruthy();
    expect(classPersistence.updateClass).not.toHaveBeenCalled();
  });

  it('should call deleteClass and return the number of class deleted', async () => {
    (classPersistence.deleteClass as jest.Mock).mockReturnValue(Promise.resolve(1));
    (classPermissionService.validateObjClassMatchRequester as jest.Mock).mockReturnValue(
      Promise.resolve(Permission.ALLOW),
    );

    const result = await classResolver.deleteClass(null, { id: '5b217b030825622c97d3757f' }, MOCK_PRINCIPLE_CONTEXT);
    expect(result).toEqual(1);
    expect(classPersistence.deleteClass).toHaveBeenCalledWith('5b217b030825622c97d3757f');
  });

  it('should call deleteClass and raise exception for "no permission for teacher"', async () => {
    (classPermissionService.validateObjClassMatchRequester as jest.Mock).mockReturnValue(
      Promise.resolve(Permission.FORBID),
    );

    let err = false;
    try {
      await classResolver.deleteClass(null, { id: 'test_classid' }, MOCK_TEACHER_CONTEXT);
    } catch (e) {
      err = true;
    }
    expect(err).toBeTruthy();
  });
});
