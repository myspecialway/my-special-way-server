jest.mock('nodemailer');
import * as nodemailer from 'nodemailer';
import { SendEmail } from './email.client';

describe('email.client', () => {
  let transportMock;
  let instance: SendEmail;

  beforeEach(() => {
    const createTransportMock = nodemailer.createTransport as jest.Mock;
    transportMock = {
      sendMail: jest.fn(),
    };

    transportMock.sendMail.mockReturnValue = '';
    createTransportMock.mockReturnValue(transportMock);
    instance = new SendEmail();
  });

  it('test send email', async () => {
    const result = await instance.send('from@addr', 'to@addr', 'subject', 'body');
    expect(transportMock.sendMail).toHaveBeenCalledWith(
      { from: 'from@addr', html: 'body', subject: 'subject', text: undefined, to: 'to@addr' },
      expect.any(Function),
    );
  });
});
