import { Response } from 'express';
import { Controller, Body, Res, Post, Logger, BadRequestException } from '@nestjs/common';
import { UserLoginRequest } from '../../../models/user-login-request.model';
import { AuthService } from '../auth-service/auth.service';
import { UserUniqueValidationRequest } from '../../../models/user-unique-validation-request.model';

@Controller()
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Res() res: Response, @Body() body: UserLoginRequest): Promise<void> {
    if (!body) {
      return this.noBodyError('login', res);
    }

    this.logger.log(`login:: login request for ${body.username}`);
    const [error, token] = await this.authService.createTokenFromCridentials(body);

    if (error) {
      this.logger.error(`login:: error while logging in ${body.username}`, error.stack);
      res.status(500).json({
        error: 'server error',
        message: 'unknown server error',
      });

      return;
    }

    if (!token) {
      this.logger.warn(`login:: token wasnt created for ${body.username}`);
      res.status(401).json({
        error: 'unauthenticated',
        message: 'username of password are incorrect',
      });

      return;
    }

    this.logger.log(`login:: token ${token} created for ${body.username}`);
    res.json({
      accessToken: token,
    });
  }

  @Post('/validateUserNameUnique')
  async validateUserNameUnique(@Res() res: Response, @Body() body: UserUniqueValidationRequest): Promise<void> {
    if (!body) {
      return this.noBodyError('validateUserNameUnique', res);
    }
    this.logger.log(`validateUserNameUnique:: validateUserNameUnique request for ${body.username}`);
    const [error, isUnique] = await this.authService.validateUserNameUnique(body);
    if (error) {
      this.logger.error(`validateUserNameUnique:: error validating username ${body.username}`, error.stack);
      res.status(500).json({
        error: 'server error',
        message: 'unknown server error',
      });
      return;
    }
    res.json({ isUnique });
  }

  private noBodyError(fn: string, res: Response) {
    this.logger.warn(`${fn}:: request body is empty`);
    res.status(400).send(new BadRequestException({ message: `must pass ${fn} request` }));
    return;
  }
}
