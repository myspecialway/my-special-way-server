import { ReminderTimeDbModel } from './reminder-time.db.model';

export interface IReminder {
  enabled: boolean;
  type: ReminderType;
  schedule: ReminderTimeDbModel[];
}

export enum ReminderType {
  MEDICINE = 'תרופה',
  REHAB = 'גמילה',
}

export const DEFAULT_REMINDERS: IReminder[] = [
  {
    enabled: false,
    type: ReminderType.MEDICINE,
    schedule: [],
  },
  {
    enabled: false,
    type: ReminderType.REHAB,
    schedule: [],
  },
];
