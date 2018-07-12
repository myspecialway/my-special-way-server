import { UserRole } from './user.db.model';

export interface UserTokenProfile {
    id: string;
    username: string;
    role: UserRole;
    firstname: string;
    lastname: string;
}