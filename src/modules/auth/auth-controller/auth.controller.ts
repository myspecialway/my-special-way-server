import { Response } from 'express';
import { Controller, Body, Res, Post, Logger, BadRequestException } from '@nestjs/common';
import { UserLoginRequest } from '../../../models/user-login-request.model';
import { AuthService } from '../auth-service/auth.service';
import { UserUniqueValidationRequest } from '../../../models/user-unique-validation-request.model';
import { sendemail } from '../../../utils/node-mailer';

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
    this.authService.handlePushToken(body);
  }

  @Post('/restore-password')
  async restorePassword(@Res() res: Response, @Body() body: any): Promise<void> {
    if (!body) {
      return this.noBodyError('restorePassword', res);
    }
    this.logger.log(JSON.stringify(body.email));
    try {
      let restoreTemplate: string = `
      <!DOCTYPE html>
        <html>
          <head dir="rtl" lang="he">
	          <meta charset="utf-8" />
            <style type="text/css">
              body {background-color: white;}
              .textStyle   {
                font-family: Rubik;
                color: #222222;
                letter-spacing: 0.2px;
                dir: "rtl";
                }
              .linkStyle{
                font-family: Rubik;
                color: #222222;
                letter-spacing: 0.2px;
              }
            </style>
          </head>`;

      restoreTemplate += `<body style="text-align:right;">
            <div class="textStyle">,${body.firstname} ${body.lastname} שלום</div>
            <br/>
            <div class="textStyle">אנו מברכים על הצטרפותך למערכת בדרכי שלי - בית הספר יחדיו.&rlm;<br/>
            המערכת מאפשרת לך לנהל את רשימות התלמידים, מערכת השעות שלהם, תזכורות שונות ועוד.&rlm;</div>
            <br/>
            <div class="textStyle">.${body.username} :שם המשתמש שלך<br/>
            :על מנת להתחיל להשתמש במערכת, יש ללחוץ על הלינק הבא ולהגדיר את סיסמתך</div>
            <div class="linkStyle"><a href ="#">http://www.example.com</a></div>
            <br/>
            <div class="textStyle">!תודה שהצטרפת</div>
          </body>
        </html> `;
      const result = await sendemail(
        `"בדרכי שלי"<mswemailclient@gmail.com>`,
        body.email,
        'שחזור ססמא למערכת בדרכי שלי ',
        restoreTemplate,
      );
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

  private noBodyError(fn: string, res: Response): Promise<void> {
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
