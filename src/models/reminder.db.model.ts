import { TimeSlotDbModel } from 'models/timeslot.db.model';
export interface Reminders {
  enabled: boolean;
  data: Reminder[];
}

export interface Reminder {
  type: ReminderType;
  schedule: TimeSlotDbModel[];
}

export enum ReminderType {
  MEDICINE = 'תרופה',
  REHAB = 'גמילה',
}
