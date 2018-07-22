import { LessonDbModel } from './lesson.db.model';
import RoomDbModel from './location.db.model';

// Describes a single timeslot on the schedule
export interface TimeSlotDbModel {
    index: string;
    lesson?: LessonDbModel;
    room?: RoomDbModel;
}
