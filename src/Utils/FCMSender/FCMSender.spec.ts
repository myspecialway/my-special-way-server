jest.mock('firebase-admin');
import { FCMSender } from './FCMSender';
import * as admin from 'firebase-admin';
// import * as AdminRoot from 'firebase-admin-mock';

describe('FCMSender', () => {
    let instance: FCMSender;
    let bResult: boolean;
    let messageMock;

    beforeAll(() => {
        bResult = false;
        instance = new FCMSender();
    });

    beforeEach(() => {
        // const adminMessaging = admin.messaging as jest.Mock;
        const AdminMessaging = jest.fn<admin.messaging.Messaging>(() => ({
            send: jest.fn(),
        }));

        const adminMessaging = new AdminMessaging();

        messageMock = {
            send: jest.fn(),
        };

        messageMock.send.mockReturnValue = true;
        //  adminMessaging.mockReturnValue(messageMock);
        // (admin.messaging as jest.Mock).mockImplementation(() => {

        // adminMessaging.mockImplementation(() => {
        //     messageMock();
        // });
    });

    // Testing an attempt to send a message before initializing any details
    it('should fail when sending text message before initialization', async () => {
        // given

        // when
//        bResult = await instance.sendTxtMsgToAndroid('sToken', '', '' );
        // then

        expect(instance).toBeInstanceOf(FCMSender);
        bResult = await instance.sendTxtMsgToAndroid('sToken', 'sBody', 'sSbj');
        expect(messageMock.send).toHaveBeenCalled();
        // expect(messageMock.sendTxtMsgToAndroid).toHaveBeenCalledWith(
        //     {clientToken: 'aaa', messageBody: 'bbb', messageTitle: 'ccc'},
        //     expect.any(Function));

        // expect(bResult).toBe(false);
    });

    // Testing an attempt to send a message using mock functions
    it('should succeed when sending Android push text message', async () => {
        expect(instance).toBeInstanceOf(FCMSender);
        // bResult = await instance.sendTxtMsgToAndroid('sToken', 'sBody', 'sSbj');
        // expect(bResult).toBe( true );
    });

});
