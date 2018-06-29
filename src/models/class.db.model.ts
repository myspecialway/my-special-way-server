import { TimeSlotDbModel } from './timeslot.db.model';

export interface ClassDbModel {
  _id: string;
  name: string;
  level: number;
  number: number;
  schedule?: TimeSlotDbModel[];
}
