import { LessonDbModel } from './lesson.db.model';
import LocationDbModel from './location.db.model';
import { OriginalDbData } from './original.db.mode';

// Describes a single timeslot on the schedule
export interface TimeSlotDbModel {
  index: string;
  hours: string;
  lesson?: LessonDbModel;
  room?: LocationDbModel;
  original?: OriginalDbData;
  lesson?: LessonDbModel;
  location?: LocationDbModel;
  customized?: boolean;
}
