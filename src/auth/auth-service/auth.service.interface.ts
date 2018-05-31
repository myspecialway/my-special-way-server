import { UserCridentials } from '../../models/user-cridentials.model';

export interface AuthServiceInterface{
    createTokenFromCridentials(userCridentials: UserCridentials);
    validateUserByCridentials(userCridentials: UserCridentials);
}