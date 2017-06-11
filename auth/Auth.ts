/**
 * Created by GolemXIV on 11.06.2017.
 */
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {Value} from "ts-json-properties";
import {Observable} from "rxjs/Observable";

export class AuthService {
    @Value("config.settings")
    private settings: any;

    public createToken(email: string): Promise<string> {
        let payload = {email: email};
        let callback = (err, decoded) => {
            if (err) {
                throw err;
            } else {
                return decoded;
            }
        };
        jwt.sign(payload, this.settings.key, {expiresIn: 60 * 60}, callback);
        return new Promise(callback);
    }

    public verifyToken(token: string): Promise<boolean> {
        let callback = (err, decoded) => !err || decoded;
        jwt.verify(token, this.settings.key, callback);
        return new Promise(callback);
    }

    public createHash(password: string): Observable<string> {
        return Observable.fromPromise(bcrypt.hash(password, this.settings.saltRounds));
    }

    public checkHash(password: string, hash: string): Observable<boolean> {
        return Observable.fromPromise(bcrypt.compare(password, hash));
    }
}

export const authService = new AuthService();
