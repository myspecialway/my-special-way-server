import * as mailClient from './email.client';
import { sendemail } from './email.client';

describe('email.client', () => {
    let nodemailer: any;

    test ('testing the return value', async () => {
        expect(sendemail('kfir@kfir.com', 'dk080e@intl.att.com', 'sdfsdf', 'asdasda')).toBe('');
    });

    beforeEach(() => {
        nodemailer = {
            createTransport: jest.fn(),
            sendMail: jest.fn(),

        };

    });

    it ('test successful send email', async () => {
        const success = await sendemail('kfir@kfir.com', 'dk080e@intl.att.com', 'sdfsdf', 'asdasda');
        expect(success).toBe('');
    });

});
