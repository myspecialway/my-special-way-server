import { ReminderTimeDbModel } from './reminder-time.db.model';

export type ReminderTypeKey = keyof typeof ReminderType;

export interface IReminder {
  enabled: boolean;
  type: ReminderTypeKey;
  schedule: ReminderTimeDbModel[];
}

export enum ReminderType {
  MEDICINE = 'תרופה',
  REHAB = 'גמילה',
}

export const getReminderTypeKeys = Object.keys(ReminderType) as ReminderTypeKey[];

export const DEFAULT_REMINDERS: IReminder[] = getReminderTypeKeys.map((key: ReminderTypeKey) => ({
  enabled: false,
  type: key,
  schedule: [],
}));
