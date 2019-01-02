import { ClassLogic } from './class-logic.service';
import { LessonDbModel } from '../../../../../models/lesson.db.model';
import { TimeSlotDbModel } from '../../../../../models/timeslot.db.model';
import { DateUtilesService } from '../../utiles/services/date-service';
import * as cloneDeep from 'lodash/cloneDeep';

describe('ClassLogic', () => {
  const baseMockScheduler: TimeSlotDbModel[] = [
    {
      index: 'not expired',
      hours: '08:00 - 08:50',
      original: null,
      lesson: {
        _id: '5bfaa65abc22fa3230947a20',
        title: 'אנגלית מוסיקלית',
        icon: 'musical-english',
      },
      location: {
        _id: '5bfaa65abc22fa3230947a19',
        name: '1 מעלית קומה',
        location_id: 'E_7',
        icon: null,
        type: null,
        position: {},
      },
    },
    {
      index: 'expired',
      hours: '08: 00 - 08: 50',
      original: {
        expired: new Date('2019 - 01 - 23T09: 35: 45.504Z'),
        lesson: {
          _id: '5bfaa65abc22fa3230947a20',
          title: 'אנגלית מוסיקלית',
          icon: 'musical - english',
        },
        location: {
          _id: '5bfaa65abc22fa3230947a19',
          name: '1 מעלית קומה',
          location_id: 'E_7',
          position: {
            floor: 1,
          },
          icon: null,
          type: null,
        },
      },
      lesson: {
        _id: '5bfaa65abc22fa3230947a20',
        title: 'אנגלית מוסיקלית',
        icon: 'musical - english',
      },
      location: {
        _id: '5bfaa65abc22fa3230947a19',
        name: '1 מעלית קומה',
        location_id: 'E_7',
        position: {
          floor: 1,
        },
        icon: null,
        type: null,
      },
    },
  ];
  const dateUtilesService: DateUtilesService = {
    isExpired: jest.fn().mockReturnValue(false),
  };

  describe('when api called ', () => {
    let classLogic: ClassLogic;
    beforeEach(() => {
      classLogic = new ClassLogic(dateUtilesService as DateUtilesService);
    });
    it('should return an error if wrong grade has been received', () => {
      const [error, schedule] = classLogic.buildDefaultSchedule('aa');

      expect(error).toBeDefined();
      expect(schedule.length).toBe(0);
    });

    it('should return schedule for valid elementary input', () => {
      const [error, schedule] = classLogic.buildDefaultSchedule('a');

      expect(error).toBeNull();
      expect(schedule).toBeDefined();
    });

    it('should return schedule for valid junior input', () => {
      const [error, schedule] = classLogic.buildDefaultSchedule('f');
      expect(error).toBeNull();
      expect(schedule).toBeDefined();
    });

    it('should fix the schedule with id from lessons list', () => {
      const lessons: LessonDbModel[] = [
        {
          _id: '12345',
          title: 'title',
          icon: 'anyIcon',
        },
      ];
      const schedule: TimeSlotDbModel[] = [
        {
          index: 'anyIndex',
          hours: 'anyHour',
          lesson: {
            title: 'title',
            icon: 'otherIcon',
            _id: undefined,
          },
        },
      ];
      classLogic.fixLessonIds(lessons, schedule);
      const slot = schedule.find((s) => {
        return s.lesson.title === 'title';
      });
      expect(slot).not.toBeNull();
      expect(slot.lesson._id).toBe('12345');
      expect(slot.lesson.icon).toBe('anyIcon');
    });
  });
  describe('when merge Scheduler called ', () => {
    let classLogic: ClassLogic;
    const dateUtilesService1: DateUtilesService = {
      isExpired: jest.fn().mockReturnValue(false),
    };
    beforeEach(() => {
      classLogic = new ClassLogic(dateUtilesService1 as DateUtilesService);
    });

    it('should not find scheduler items if noting is expired', () => {
      const deepCopy = cloneDeep(baseMockScheduler);
      const schedulerWrapper = classLogic.mergeSchedulerClass(deepCopy);
      const found = deepCopy.find((item) => {
        return item.index === 'expired';
      });
      expect(schedulerWrapper.isUpdate).toBeFalsy();
      expect(schedulerWrapper.schedule.length).toBe(0);
      expect(found).not.toBeNull();
      expect(found.original).toBeDefined();
      expect(found.original.expired).toBeDefined();
    });
  });

  describe('when merge Scheduler called ', () => {
    let classLogic: ClassLogic;
    const dateUtilesService1: DateUtilesService = {
      isExpired: jest.fn().mockReturnValue(true),
    };

    beforeEach(() => {
      classLogic = new ClassLogic(dateUtilesService1 as DateUtilesService);
    });

    it('should remove expired items without base state(base state is empty)', () => {
      const deepCopy = cloneDeep(baseMockScheduler);
      // defined item with base state empty
      deepCopy.forEach((item) => {
        if (item.index === 'expired') {
          item.original.lesson = undefined;
          item.original.location = undefined;
        }
      });

      const schedulerWrapper = classLogic.mergeSchedulerClass(deepCopy);
      expect(schedulerWrapper.schedule.length).toBe(1);
      expect(schedulerWrapper.isUpdate).toBeTruthy();
      expect(deepCopy.length).toBe(2);
      const schedulerExpiredFound = schedulerWrapper.schedule.find((item) => {
        return item.index === 'expired';
      });
      expect(schedulerExpiredFound).toBeUndefined();
    });
  });

  describe('when merge Scheduler called ', () => {
    let classLogic: ClassLogic;
    const dateUtilesService1: DateUtilesService = {
      isExpired: jest
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true),
    };

    beforeEach(() => {
      classLogic = new ClassLogic(dateUtilesService1 as DateUtilesService);
    });

    it('should update items that expired to base state(original state) ', () => {
      const deepCopy = cloneDeep(baseMockScheduler);
      const schedulerWrapper = classLogic.mergeSchedulerClass(deepCopy);
      const found = deepCopy.find((item) => {
        return item.index === 'expired';
      });

      expect(found).not.toBeNull();
      expect(found.original).not.toBeNull();

      expect(schedulerWrapper.isUpdate).toBeTruthy();
      const schedulerExpiredFound = schedulerWrapper.schedule.find((item) => {
        return item.index === 'expired';
      });
      expect(schedulerExpiredFound.original).toBeUndefined();
      expect(found.original.lesson).toEqual(schedulerExpiredFound.lesson);
      expect(found.original.location).toEqual(schedulerExpiredFound.location);
      expect(deepCopy.length).toEqual(schedulerWrapper.schedule.length);
    });
  });
});
