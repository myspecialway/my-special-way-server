import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UserCridentials } from '../../../models/user-credentials.model';
import { AuthServiceInterface } from './auth.service.interface';

export const JWT_SECRET = '3678ee53-5207-4124-bc58-fef9d48d12b1';
const testUsers = [
    {
        username: 'msw',
        password: 'Aa123456',
    },
];

@Injectable()
export class AuthService implements AuthServiceInterface {

    /* istanbul ignore next */
    async createTokenFromCridentials(userCridentials: UserCridentials) {
        // TODO: add real DB integration and hashing function
        const user = await this.validateUserByCridentials(userCridentials);
        if (!user) {
            return null;
        }

        return jwt.sign(userCridentials, JWT_SECRET);

    }

    /* istanbul ignore next */
    async validateUserByCridentials(userCridentials: UserCridentials) {
        return testUsers.find(u =>
            u.username === userCridentials.username &&
            u.password === userCridentials.password,
        );
    }
}