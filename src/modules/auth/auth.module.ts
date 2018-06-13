import { NestModule, Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthService } from './auth-service/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth-controller/auth.controller';
import { PersistenceModule } from '../persistence/persistence.module';
@Module({
    imports: [
        PersistenceModule,
    ],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    controllers: [
        AuthController,
    ],
})
export class AuthModule { }