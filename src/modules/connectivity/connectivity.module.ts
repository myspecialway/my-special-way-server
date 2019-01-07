import { Module } from '@nestjs/common';
import { ConnectivityController } from './connectivity-controller/connectivity.controller';
import { ConnectivityService } from './connectivity-service/connectivity.service';

@Module({
  providers: [ConnectivityService],
  controllers: [ConnectivityController],
})
export class ConnectivityModule {}
