import { Module } from '@nestjs/common';
import { SendEmail } from './email.client';

@Module({
  providers: [SendEmail],
  exports: [SendEmail],
})
export class SendEmailModule {}
