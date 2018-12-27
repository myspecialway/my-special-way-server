import { LessonDbModel } from './lesson.db.model';
import LocationDbModel from './location.db.model';

// Describes a single timeslot on the schedule
export interface TimeSlotDbModel {
  index: string;
  hours: string;
  lesson?: LessonDbModel;
  room?: LocationDbModel;
  customized?: boolean;
}
