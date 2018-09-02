import { TimeSlotDbModel } from './timeslot.db.model';
import { EducationStage } from './education-stage.enum';

export interface ClassDbModel {
  _id?: string;
  name: string;
  grade: string;
  schedule?: TimeSlotDbModel[];
}
