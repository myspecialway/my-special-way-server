export interface UserDbModel {
    _id: string;
    username: string;
    password: string;
    passwordSalt: string;
    firstname: string;
    lastname: string;
    email: string;
    role: UserRole;
    class_id: string;
}

export enum UserRole {
    PRINCIPLE = 'PRINCIPLE',
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT',
}