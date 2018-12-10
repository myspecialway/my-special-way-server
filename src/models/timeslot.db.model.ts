import { LessonDbModel } from './lesson.db.model';
import LocationDbModel from './location.db.model';
import { TemporalDbData } from './temporal.db.mode';

// Describes a single timeslot on the schedule
export interface TimeSlotDbModel {
  index: string;
  hours: string;
  temporal?: TemporalDbData;
  lesson?: LessonDbModel;
  room?: LocationDbModel;
  customized?: boolean;
}
