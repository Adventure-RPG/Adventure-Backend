import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {Component, HttpException, HttpStatus, Inject} from '@nestjs/common';
import {AuthService} from '../services/auth.service';
import {config} from '../../../app.util';

@Component()
export class JwtStrategy extends Strategy {

    constructor(private readonly authService: AuthService) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
                secretOrKey: config.jwt.secretKey,
            },
            async (req, payload, next) => await this.verify(req, payload, next),
        );
        passport.use(this);
    }

    public async verify(req, payload, done) {
        const isValid = await this.authService.validate(payload);
        if (!isValid) {
            return done('Unauthorized', false);
        }
        done(null, payload);
    }
}