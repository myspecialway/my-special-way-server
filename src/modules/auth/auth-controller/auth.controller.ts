import { Response } from 'express';
import { Controller, Body, Res, Post } from '@nestjs/common';
import { AuthService } from '../auth-service/auth.service';
import { UserLoginRequest } from 'models/user-login-request.model';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    async login(@Res() res: Response, @Body() body: UserLoginRequest): Promise<void> {
        const [error, token] = await this.authService.createTokenFromCridentials(body);

        if (error) {
            res.status(500).json({
                error: 'server error',
                message: 'unknown server error',
            });
        }

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
