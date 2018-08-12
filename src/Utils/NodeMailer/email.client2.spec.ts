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

    /*

    // Testing the mailing options
    test('Email From assignment', () => { expect( instance.SetMailOptionsFrom( '"Special Way" <testmyspecialway@gmail.com>' ) ).toBeCalled();   });
    test('Email To assignment', () => { expect( instance.SetMailOptionsTo( '"Special Way" <testmyspecialway@gmail.com>' ) ).toBeCalled();       });
    test('Email Subject assignment', () => { expect( instance.SetMailOptionsSubject( '"Hello World"') ).toBeCalled();                           });
    test('Text body assignment', () => { expect( instance.SetMailOptionsBodyText( '"Hello World"') ).toBeCalled();                              });
    test('HTML body assignment', () => { expect( instance.SetMailOptionsBodyHTML( '"Hello World"') ).toBeCalled();                              });

    // Testing the mailing options
    test('Transporter, host', () => { expect( instance.SetTransporterHost( '"abc' ) ).toBeCalled();         });
    test('Transporter, port', () => { expect( instance.SetTransporterPort( 123 ) ).toBeCalled();            });
    test('Transporter, comm', () => { expect( instance.SetTransporterSecure( true ) ).toBeCalled();         });
    test('Transporter, username', () => { expect( instance.SetTransporterUsername( '123' ) ).toBeCalled();  });
    test('Transporter, password', () => { expect( instance.SetTransporterPassword( '123' ) ).toBeCalled();  });
*/
    test('Get last error', () => { expect( instance.GetLastError() ).toBeCalled(); });

    test('Building Transporter', () => { expect( instance.SetTransporter( 'strHost', 123, true, 'user', 'password') ).toBeCalled(); });
});
