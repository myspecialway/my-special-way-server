export interface UserDbModel {
    _id: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    role: UserType;
}

enum UserType {
    PRINCIPLE = 'PRINCIPLE',
    TEACHER = 'TEACHER',
}