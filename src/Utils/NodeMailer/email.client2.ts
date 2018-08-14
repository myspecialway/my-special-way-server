import * as nodemailer from 'nodemailer';
import { CONFIG } from './smtp.config';

export class EmailClient {
    private transporter: nodemailer.Transport;
    private mailoptionair: nodemailer.mailoptions;
    private strLastError = '';

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: CONFIG.host,
            port: CONFIG.port,
            secure: CONFIG.secure,      // true for 465, false for other ports
            auth: {
                user: CONFIG.username,
                pass: CONFIG.password,
            },
            tls: {
              rejectUnauthorized: false,
            },
        });
    }

    SetTransporterHost( strHost: string ) { this.transporter.host = strHost;        }
    SetTransporterPort( nPort: number ) {this.transporter.port = nPort;             }
    SetTransporterSecure( bSecure: boolean ) {this.transporter.secure = bSecure;    }
    SetTransporterUsername( strUser: string) {this.transporter.user = strUser;      }
    SetTransporterPassword( strPass: string) {this.transporter.pass = strPass;      }

    SetTransporter(strHost: string, nPort: number, bSecure: boolean, strUser: string, strPass: string) {
        this.transporter = nodemailer.createTransport({
            host: strHost,
            port: nPort,
            secure: bSecure,      // true for 465, false for other ports
            auth: {
                user: strUser,
                pass: strPass,
            },
            tls: {
              rejectUnauthorized: false,
            },
        });
    }

    SetMailOptionsFrom( strFrom: string ) { this.mailoptionair.from = strFrom; }
    SetMailOptionsTo( strTo: string ) { this.mailoptionair.To = strTo; }
    SetMailOptionsSubject( strSubject: string ) { this.mailoptionair.subject = strSubject; }
    SetMailOptionsBodyText( strBodyText: string ) { this.mailoptionair.text = strBodyText; }
    SetMailOptionsBodyHTML( strBodyHTML: string ) { this.mailoptionair.html = strBodyHTML; }

    SetMailOptions(strFrom: string, strTo: string, strSubject: string, strBodyHTML: string, strBodyText = '') {
         this.mailoptionair = {
            from: strFrom,
            to: strTo,
            subject: strSubject,
            text: strBodyText,    // plain text body
            html: strBodyHTML,     // html body
        };
    }

    sendEmail(emailFrom: string, emailTo: string, emailSubject: string, emailBodyHTML: string, emailBodyText: string): boolean {
        let bResult: boolean;
        bResult = false;

        // setup email data with unicode symbols
        this.SetMailOptions(emailFrom, emailTo, emailSubject, emailBodyHTML, emailBodyText );

        // send mail with defined transport object
        this.transporter.sendMail(this.mailoptionair, (error, info) => {
            /* istanbul ignore next */
            if (error) {
                this.strLastError = error;
                bResult = false;
            // more information about the results can be found here: https://nodemailer.com/usage/
            } else { bResult = true; }
        });

        return bResult;
    }

    GetLastError() {
        return this.strLastError;
    }
}
