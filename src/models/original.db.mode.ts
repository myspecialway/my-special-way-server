import { LessonDbModel } from './lesson.db.model';
import LocationDbModel from './location.db.model';

// Describes a single timeslot on the schedule
export interface OriginalDbData {
  expired: Date;
  lesson?: LessonDbModel;
  room?: LocationDbModel;
}
