import { ClassLogic } from './class-logic.service';
import { LessonDbModel } from '../../../../../models/lesson.db.model';
import { TimeSlotDbModel } from '../../../../../models/timeslot.db.model';

describe('ClassLogic', () => {
  let classLogic: ClassLogic;

  beforeEach(() => {
    classLogic = new ClassLogic();
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
