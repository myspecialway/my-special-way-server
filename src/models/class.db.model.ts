import { TimeSlotDbModel } from './timeslot.db.model';

export interface ClassDbModel {
  _id?: string;
  name: string;
  grade: string;
  schedule?: TimeSlotDbModel[];
}
