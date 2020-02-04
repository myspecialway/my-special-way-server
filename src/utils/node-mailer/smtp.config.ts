import { getConfig } from '../../config/config-loader';

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
}

export const CONFIG: SMTPConfig = {
  host: 'smtp.gmail.com', // SMTP Server address
  port: 587, // SMTP server port
  secure: false, // true for 465, false for other ports
  username: 'username', // SMTP username
  password: 'password', // SMTP passowrd adding a comment just for testing the build
};
