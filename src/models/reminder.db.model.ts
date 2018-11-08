import { ReminderTimeDbModel } from './reminder-time.db.model';

export interface Reminders {
  enabled: boolean;
  data: Reminder[];
}

export interface Reminder {
  type: ReminderType;
  schedule: ReminderTimeDbModel[];
}

export enum ReminderType {
  MEDICINE = 'תרופה',
  REHAB = 'גמילה',
}

export const DEFAULT_REMINDERS: Reminders = {
  enabled: false,
  data: [],
};
