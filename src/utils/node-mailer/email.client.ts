import * as nodemailer from 'nodemailer';
import { CONFIG } from './smtp.config';
import { Logger } from '@nestjs/common';

export async function sendemail(
  emailFrom: string,
  emailTo: string,
  emailSubject: string,
  emailBodyHTML: string,
  emailBodyText?: string,
): Promise<boolean> {
  const logger = new Logger('email-client');
  logger.log('EmailClient:: Calling sendmail');

  const transporter = nodemailer.createTransport({
    host: CONFIG.host,
    port: CONFIG.port,
    secure: CONFIG.secure, // true for 465, false for other ports
    auth: {
      user: CONFIG.username,
      pass: CONFIG.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: emailFrom,
    to: emailTo,
    subject: emailSubject,
    text: emailBodyText, // plain text body
    html: emailBodyHTML, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    /* istanbul ignore next */
    if (error) {
      logger.log('EmailClient:: Failed. Error: ' && error.name && ' - ' && error.message);
      return false;
    }
  });

  return true;
}
