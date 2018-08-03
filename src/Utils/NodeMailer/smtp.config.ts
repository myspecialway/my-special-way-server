export interface SMTPConfig {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;    
  }
  
export const CONFIG: SMTPConfig ={
    host: 'smtp.gmail.com',                 // SMTP Server address
    port: 587,                              // SMTP server port
    secure: false,                          // true for 465, false for other ports
    username: 'mmyspecialway@gmail.com',    // SMTP username
    password: 'MspecialW!G'                 // SMTP passowrd
};