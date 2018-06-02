import { UserCridentials } from '../../../models/user-credentials.model';

export interface AuthServiceInterface{
    createTokenFromCridentials(userCridentials: UserCridentials);
    validateUserByCridentials(userCridentials: UserCridentials);
}