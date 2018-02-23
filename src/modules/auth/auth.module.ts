import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {userProviders} from './providers/user.providers';
import {DatabaseModule} from '../database/database.module';
import {UserController} from './controllers/user.controller';
import {UserService} from './services/user.service';
import {AuthService} from './services/auth.service';
import {AuthMiddleware} from './middlewares/auth.middleware';
import {AuthController} from './controllers/auth.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController, AuthController],
    components: [UserService, AuthService, ...userProviders],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(AuthMiddleware).forRoutes(
            {path: '/users', method: RequestMethod.GET},
        );
    }

}
