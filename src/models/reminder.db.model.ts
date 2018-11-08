import { ReminderTimeDbModel } from './reminder-time.db.model';

export interface IReminders {
  enabled: boolean;
  data: IReminder[];
}

export interface IReminder {
  type: ReminderType;
  schedule: ReminderTimeDbModel[];
}

export enum ReminderType {
  MEDICINE = 'תרופה',
  REHAB = 'גמילה',
}

export const DEFAULT_REMINDERS: IReminders = {
  enabled: false,
  data: [],
};
