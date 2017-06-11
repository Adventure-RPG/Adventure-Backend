/**
 * Created by GolemXIV on 11.06.2017.
 */
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {Value} from "ts-json-properties";
import {Observable} from "rxjs/Observable";
import Rx from 'rxjs/Rx';

export class AuthService {
    @Value("config.settings")
    private settings: any;

    public createToken(email: string): Observable<string> {
        let payload = {email: email};
        let callback = (err, decoded) => {
            if (err) {
                throw err;
            } else {
                return decoded;
            }
        };
        jwt.sign(payload, this.settings.key, {expiresIn: 60 * 60}, callback);
        Rx.Observable.range(1, 3)
            .map(function (x, idx, obs) {
                return x * x;
            });

        return Observable.bindCallback(callback);
    }

    public verifyToken(token: string): Observable<boolean> {
        let callback = (err, decoded) => !err || decoded;
        jwt.verify(token, this.settings.key, callback);
        return Observable.bindCallback(callback);
    }

    public createHash(password: string): Observable<string> {
        return Observable.fromPromise(bcrypt.hash(password, this.settings.saltRounds));
    }

    public checkHash(password: string, hash: string): Observable<boolean> {
        return Observable.fromPromise(bcrypt.compare(password, hash));
    }
}

export const authService = new AuthService();
