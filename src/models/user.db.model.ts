import { ObjectID } from 'mongodb';
import { TimeSlotDbModel } from './timeslot.db.model';

export interface UserDbModel {
    _id: string | ObjectID;
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
