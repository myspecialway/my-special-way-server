jest.mock('nodemailer');
import { sendemail } from './email.client';
import * as nodemailer from 'nodemailer';
import { getConfig } from '../../config/config-loader';
import { ProcessEnvConfig } from '../../config/config-interface';

describe('email.client', () => {
  let transportMock;

  beforeEach(() => {
    const createTransportMock = nodemailer.createTransport as jest.Mock;
    transportMock = {
      sendMail: jest.fn(),
    };

    (getConfig as jest.Mock).mockReturnValue({
      EMAIL_CLIENT_USERNAME: '',
      EMAIL_CLIENT_PASSWORD: '',
  } as ProcessEnvConfig);

    transportMock.sendMail.mockReturnValue = '';
    createTransportMock.mockReturnValue(transportMock);
  });

  it('test send email', async () => {
    const result = await sendemail('from@addr', 'to@addr', 'subject', 'body');
    expect(transportMock.sendMail).toHaveBeenCalledWith(
      { from: 'from@addr', html: 'body', subject: 'subject', text: undefined, to: 'to@addr' },
      expect.any(Function),
    );
  });
});
