import { Module } from '@nestjs/common';
import { FCMSender } from './FCMSender';

@Module({
  providers: [FCMSender],
  exports: [FCMSender],
})
export class FCMModule {}
