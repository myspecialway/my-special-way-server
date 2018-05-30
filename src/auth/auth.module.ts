
import { NestModule, Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthService } from './auth-service/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
    providers: [
        AuthService,
        JwtStrategy,
    ],
    controllers: [
        AuthController,
    ],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    }
}