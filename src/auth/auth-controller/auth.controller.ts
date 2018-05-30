import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Controller, Body, Res, Post } from '@nestjs/common';
import { AuthService } from '../auth-service/auth.service';
import { UserCridentials } from '../../models/user-cridentials.model';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    async login(@Res() res: Response, @Body() body: UserCridentials): Promise<void> {
        const token = await this.authService.createTokenFromCridentials(body);
        if (!token) {
            res.status(401).json({
                error: 'unauthenticated',
                message: 'username of password are incorrect',
            });

            return;
        }
        res.json({
            accessToken: token,
        });
    }
}
