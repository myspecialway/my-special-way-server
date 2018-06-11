import { UserTokenProfile } from '../../../models/user-token-profile.model';
import { UserLoginRequest } from 'models/user-login-request.model';

export interface AuthServiceInterface {
    createTokenFromCridentials(userLogin: UserLoginRequest);
    validateUserByCridentials(userLogin: UserLoginRequest);
}