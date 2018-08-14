import { EmailClient } from './email.client2';

describe('EmailClient', () => {
    let instance: EmailClient;
    let strResult: string;

    instance = new EmailClient();

    beforeAll(() => {
        strResult = '';
    });

    it('testing email client functionality', async () => {
        instance = new EmailClient();
        expect(instance).toBeInstanceOf(EmailClient);
        const  bResult = instance.sendEmail (
            '"Sender, sender" <sender@address>',
            '"Reciever, reciever" <reciever@address>',
            'Hello World! 👻',
            '<b>Hello world?</b>',
            'Hello world?' );
        expect(bResult).toBeDefined();
    });

    // Testing the mailing options
    test('Email From assignment', () => { expect( instance.SetMailOptionsFrom( '"Special Way" <testmyspecialway@gmail.com>' ) ).toBeUndefined();   });
    test('Email To assignment', () => { expect( instance.SetMailOptionsTo( '"Special Way" <testmyspecialway@gmail.com>' ) ).toBeUndefined();       });
    test('Email Subject assignment', () => { expect( instance.SetMailOptionsSubject( '"Hello World"') ).toBeUndefined();                           });
    test('Text body assignment', () => { expect( instance.SetMailOptionsBodyText( '"Hello World"') ).toBeUndefined();                              });
    test('HTML body assignment', () => { expect( instance.SetMailOptionsBodyHTML( '"Hello World"') ).toBeUndefined();                              });

    // Testing the mailing options
    test('Transporter, host', () => { expect( instance.SetTransporterHost( '"abc' ) ).toBeUndefined();         });
    test('Transporter, port', () => { expect( instance.SetTransporterPort( 123 ) ).toBeUndefined();            });
    test('Transporter, comm', () => { expect( instance.SetTransporterSecure( true ) ).toBeUndefined();         });
    test('Transporter, username', () => { expect( instance.SetTransporterUsername( '123' ) ).toBeUndefined();  });
    test('Transporter, password', () => { expect( instance.SetTransporterPassword( '123' ) ).toBeUndefined();  });

    test('Get last error', () => { expect( instance.GetLastError() ).toBe(''); });

    test('Building Transporter', () => { expect( instance.SetTransporter( 'strHost', 123, true, 'user', 'password') ).toBeUndefined(); });

});
