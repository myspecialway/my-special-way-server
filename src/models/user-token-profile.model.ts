import { UserRole } from './user.db.model';

export interface UserTokenProfile {
    username: string;
    role: UserRole;
}
