import { Module } from '@nestjs/common';
import { ConnectivityController } from './connectivity-controller/connectivity.controller';
import { ConnectivityService } from './connectivity-service/connectivity.service';
import { FCMModule } from 'Utils/FCMSender/fcm.module';

@Module({
  providers: [ConnectivityService],
  controllers: [ConnectivityController],
})
export class ConnectivityModule {}
