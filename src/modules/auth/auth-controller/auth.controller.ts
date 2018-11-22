import { Response } from 'express';
import { Controller, Body, Res, Post, Logger, BadRequestException } from '@nestjs/common';
import { UserLoginRequest } from '../../../models/user-login-request.model';
import { AuthService } from '../auth-service/auth.service';
import { UserUniqueValidationRequest } from '../../../models/user-unique-validation-request.model';
import { sendemail } from '../../../utils/nodeMailer/email.client';

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
    res.json({
      accessToken: token,
    });
  }

  @Post('/restore-password')
  async restorePassword(@Res() res: Response, @Body() body: any): Promise<void> {
    if (!body) {
      return this.noBodyError('restorePassword', res);
    }
    this.logger.log(JSON.stringify(body.email));
    try {
      const restoreTemplate: string = `
        <div class="email-content" style="text-align: right">
          <h1>שחזור ססמא למערכת בדרכי שלי</h1>
          <p>${body.firstname} ${body.lastname} שלום</p>
          <p>.אנו שולחים לך לינק חדש לכניסה למערכת</p>
          <p>:על מנת להתחיל להשתמש במערכת, יש ללחוץ על הלינק הבא ולהגדיר את סיסמתך</p>
          <a href="#">http://www.example.com</a>
          <p>!תודה</p>
        </div>
        `;
      const result = await sendemail('mswemailclient@gmail.com', body.email, 'שחזור ססמא', restoreTemplate);
      res.status(200).json({
        status: 'ok',
      });
      this.logger.log(`restorePassword:: restorePassword request for ${result}`);
    } catch (e) {
      this.logger.error(`login:: error while logging in ${body.email}`, 'e.stack');
      res.status(422).json({
        error: 'server error',
        message: 'unknown server error',
      });
      return;
    }
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
