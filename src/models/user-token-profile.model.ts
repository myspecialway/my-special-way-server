import { UserRole } from './user.db.model';

export class UserTokenProfile {
    id: string;
    username: string;
    role: UserRole;
    firstname: string;
    lastname: string;
    class_id?: string;
}
