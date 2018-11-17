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
  username: 'mswemailclient@gmail.com', // SMTP username
  password: 'm$wema!lCl1ent', // SMTP passowrd
};
