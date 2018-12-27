import { IReminder } from './reminder.db.model';
import { TimeSlotDbModel } from './timeslot.db.model';
import { FirstLoginData } from './user-first-login.db.model';
import { NonActiveTimeDbModel } from '@models/non-active-time.db.model';

export interface UserDbModel {
  _id: string;
  username: string;
  password: string;
  passwordSalt: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  gender: Gender;
  class_id?: string;
  schedule?: TimeSlotDbModel[];
  reminders: IReminder[];
  passwordStatus: PasswordStatus;
  firstLoginData?: FirstLoginData;
  pushToken?: string;
  nonActiveTimes?: [NonActiveTimeDbModel];
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum UserRole {
  PRINCIPLE = 'PRINCIPLE',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export enum PasswordStatus {
  NOT_SET = 'NOT_SET',
  VALID = 'VALID',
  FORGOT = 'FORGOT',
}
