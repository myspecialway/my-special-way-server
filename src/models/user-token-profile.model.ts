import { UserRole } from './user.db.model';



export interface JWTTokenPayload {
    id: string;
    username: string;
    role: UserRole;
    firstname: string;
    lastname: string;
    exp: number;
}

export interface UserTokenProfile {
    id: string;
    username: string;
    role: UserRole;
    firstname: string;
    lastname: string;
}
