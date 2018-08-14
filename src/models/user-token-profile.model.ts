import { UserRole } from './user.db.model';

export const defaultUserTokenProfile = {
    id: null,
    username: null,
    role: null,
    firstname: null,
    lastname: null,
    __typename: 'UserTokenProfile',
};

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
