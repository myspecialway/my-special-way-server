import { UserLoginRequest } from 'models/user-login-request.model';
import { UserDbModel } from '../../../models/user.db.model';
import { UserUniqueValidationRequest } from 'models/user-unique-validation-request.model';

export interface AuthServiceInterface {
  createTokenFromCridentials(userLogin: UserLoginRequest): Promise<[Error, string]>;
  validateUserByCridentials(userLogin: UserLoginRequest): Promise<[Error, UserDbModel]>;
  validateUserNameUnique(userUniqueValidation: UserUniqueValidationRequest): Promise<[Error, boolean]>;
}
