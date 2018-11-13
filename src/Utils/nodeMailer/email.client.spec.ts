jest.mock('nodemailer');
import { sendemail } from './email.client';
import * as nodemailer from 'nodemailer';

describe('email.client', () => {
    let transportMock;

    beforeEach(() => {
        const createTransportMock = nodemailer.createTransport as jest.Mock;
        transportMock = {
            sendMail: jest.fn(),
        };

        transportMock.sendMail.mockReturnValue = '';
        createTransportMock.mockReturnValue(transportMock);
    });

    it ('test send email', async () => {
        const result = await sendemail('from@addr', 'to@addr', 'subject', 'body');
        expect(transportMock.sendMail).toHaveBeenCalledWith(
            {from: 'from@addr', html: 'body', subject: 'subject', text: undefined, to: 'to@addr'},
            expect.any(Function));
    });

});
