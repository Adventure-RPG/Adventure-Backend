import {MiddlewaresConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {userProviders} from './providers/user.providers';
import {DatabaseModule} from '../database/database.module';
import {UserController} from './controllers/user.controller';
import {UserService} from './services/user.service';
import {AuthService} from './services/auth.service';
import {AuthController} from './controllers/auth.controller';
import {JwtStrategy} from './middlewares/auth.strategy';
import * as passport from 'passport';
import {EmailModule} from '../email/email.module';

@Module({
    imports: [DatabaseModule, EmailModule],
    controllers: [UserController, AuthController],
    components: [UserService, AuthService, JwtStrategy, ...userProviders],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(passport.authenticate('jwt', { session: false })).forRoutes(
            {path: '/users', method: RequestMethod.GET},
        );
    }

}
