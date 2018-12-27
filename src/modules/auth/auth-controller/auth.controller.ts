import { Response } from 'express';
import { BadRequestException, Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { UserLoginRequest } from '../../../models/user-login-request.model';
import { AuthService } from '../auth-service/auth.service';
import { UserUniqueValidationRequest } from '../../../models/user-unique-validation-request.model';
import { ResetPasswordRequest } from '../../../models/reset-password-request.model';

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
  @Post('/reset-password')
  async resetPassword(@Res() res: Response, @Body() body: ResetPasswordRequest): Promise<void> {
    if (!body) {
      return this.noBodyError('login', res);
    }

    this.logger.log(`reset-password:: reset-password request for ${body.email}`);

    const [error, sent] = await this.authService.sendResetPasswordEmail(body.email);

    if (error) {
      this.logger.error(`login:: error while send email to ${body.email}`, error.stack);
      res.status(500).json({
        error: 'server error',
        message: 'unknown server error',
      });

      return;
    }

    if (!sent) {
      this.logger.warn(`login:: email wasn't sent for ${body.email}`);
      res.status(401).json({
        error: 'unauthenticated',
        message: 'email address is incorrect',
      });

      return;
    }
    this.logger.log(`reset-password:: email sent to ${body.email}`);
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
  @Post('/first-login')
  async firstLogin(@Res() res: Response, @Body() body: { firstLoginToken: string }): Promise<void> {
    if (!body) {
      this.logger.warn('firstLogin:: request body is empty');
      res.status(400).send(new BadRequestException({ message: 'must pass token request' }));
      return;
    }
    const [error, token] = await this.authService.createTokenFromFirstLoginToken(body.firstLoginToken);

    if (error) {
      this.logger.error(`firstLogin:: error while logging first time with ${body.firstLoginToken} `, error.stack);
      res.status(500).json({
        error: `server error ${error.message || ''}`,
        message: 'unknown server error',
      });

      return;
    }

    if (!token) {
      this.logger.warn(`firstLogin:: token wasnt found  ${body.firstLoginToken}`);
      res.status(401).json({
        error: 'unauthenticated',
        message: 'first Login unauthenticated',
      });
    }
    this.logger.log(`firstLogin:: token ${token} created for ${body.firstLoginToken}`);
    res.json({
      accessToken: token,
    });
  }
}
