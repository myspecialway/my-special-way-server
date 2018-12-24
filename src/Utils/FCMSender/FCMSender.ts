import * as admin from 'firebase-admin';
import { IFCMData } from './FCM.data';
import { Injectable, Logger } from '@nestjs/common';
import { getConfig } from '../../config/config-loader';

@Injectable()
export class FCMSender {
  //  private serviceAccount = require('./my-special-way-android-firebase-adminsdk.json');
  private logger: Logger;

  constructor() {
    try {
      const config = getConfig();
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.FIREBASE_PROJECT_ID,
          clientEmail: config.FIREBASE_CLIENT_EMAIL,
          privateKey: config.FIREBASE_PRIVATE_KEY,
        }),
        databaseURL: config.FIREBASE_DB_URL,
      });
      this.logger = new Logger('FCMSender');
      this.logger.log('FCMSender: created FCMSender instance');
    } catch (ex) {
      this.logger.error('FCMSender: error', ex);
    }
  }

  /* https://firebase.google.com/docs/cloud-messaging/admin/send-messages#android-specific_fields */
  async sendTxtMsgToAndroid(clientToken: string, messageBody: string, messageTitle: string): Promise<boolean> {
    this.logger.log('FCMSender: Calling sendTxtMsgToAndroid');
    const fcmRequest = {
      android: {
        /* The time-to-live duration of the message.
        This is how long the message will be kept in FCM storage if the target devices are offline.
        Maximum allowed is 4 weeks, which is also the default.  */
        ttl: 3600 * 1000, // 1 hour in milliseconds
        notification: {
          title: messageTitle, // Title of the notification
          body: messageBody, // The body of the notification
        },
      },
      token: clientToken,
    };

    try {
      // Send a message to the device corresponding to the provided registration token.
      const response = await admin.messaging().send(fcmRequest);
      this.logger.log(
        'FCMSender: success in sending text message to client with token: ' + clientToken + '. Message ID: ' + response,
      );
      return true;
    } catch (err) {
      this.logger.log(
        'FCMSender: failure in sending text message to client with token: ' + clientToken + '. Error: ' + err,
      );
      // write to log
      return false;
    }
  }

  /* https://firebase.google.com/docs/cloud-messaging/admin/send-messages#android-specific_fields */
  async sendDataMsgToAndroid(clientToken: string, messageData: IFCMData): Promise<boolean> {
    this.logger.log('FCMSender: Calling SendDataMsgToAndroid');
    const fcmRequest = {
      data: messageData.data,
      //    data: DATA.data,
      android: {
        /* The time-to-live duration of the message.
        This is how long the message will be kept in FCM storage if the target devices are offline.
        Maximum allowed is 4 weeks, which is also the default.  */
        ttl: 3600 * 1000, // 1 hour in milliseconds
      },
      token: clientToken,
    };

    // Send a message to the device corresponding to the provided registration token.
    try {
      const response = await admin.messaging().send(fcmRequest);
      this.logger.log(
        'FCMSender: success in sending text message to client with token: ' + clientToken + '. Message ID: ',
        response,
      );
      return true;
    } catch (err) {
      this.logger.log(
        'FCMSender: failure in sending text message to client with token: ' + clientToken + '. Error: ' + err,
      );
      return false;
    }
  }
}
