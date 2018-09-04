jest.mock('firebase-admin');
import { FCMSender } from './FCMSender';
import * as admin from 'firebase-admin';

describe('FCMSender', () => {
    let instance: FCMSender;
    let strResult: string;
    let bResult: boolean;
    let messageMock;

    beforeAll(() => {
        strResult = '';
        bResult = false;
        // admin.messaging = jest.fn();
        const adminMessaging = admin.messaging as jest.Mock;
        messageMock = {
            send: jest.fn(),
        };

        messageMock.send.mockReturnValue = true;
        adminMessaging.mockReturnValue(messageMock);
    });

    beforeEach(() => {
        instance = new FCMSender();
    });

    // Testing an attempt to send a message before initializing any details
    it('should fail when sending text message before initialization', async () => {
        // given

        // when
        bResult = await instance.sendTxtMsgToAndroid('sToken', '', '' );
        // then

        // instance = new FCMSender();
        // expect(instance).toBeInstanceOf(FCMSender);
        bResult = await instance.sendTxtMsgToAndroid('sToken', 'sBody', 'sSbj');
        expect(bResult).toBe(false);
    });

    // Testing an attempt to send a message using mock functions
    it('should succeed when sending Android push text message', async () => {
        expect(instance).toBeInstanceOf(FCMSender);
        bResult = await instance.sendTxtMsgToAndroid('sToken', 'sBody', 'sSbj');
        //        expect(messageMock.send).toHaveBeenCalled();
        expect(messageMock.send).toBe( true );
    });

});
