/**
 * Created by GolemXIV on 11.06.2017.
 */
import * as jwt from "jsonwebtoken";
import {Value, Properties} from "ts-json-properties";
import * as crypto from "crypto";


export class AuthService {

    @Value("settings.jwt")
    private _jwt;

    @Value("settings.crypto")
    private _crypto;

    private settings: any;

    constructor() {
        this.settings = Properties.getValue("settings");
    }

    public createToken(email: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let payload = {email: email};
            jwt.sign(payload, this._jwt.key, {expiresIn: this._jwt.expireIn}, (err, token) => {
               if (err) {
                    reject(err);
               } else {
                   resolve(token);
               }
           });
        });
    }

    public verifyToken(token: string): Promise<boolean> {
        let callback = (err, decoded) => !err || decoded;
        jwt.verify(token, this._jwt.key, callback);
        return new Promise(callback);
    }

    public createHash(password: string): Promise<string> {
        return new Promise((resolve, reject)=> {
            crypto.randomBytes(this._crypto.saltBytes, (err, salt)=> {
                if (err) reject(err);
                crypto.pbkdf2(password, salt, this._crypto.iterations, this._crypto.hashBytes,
                    this._crypto.digest, (err, hash)=> {
                    if (err) reject(err);

                    resolve(hash.toString("base64"));
                });
            });
        });
    }
}

export const authService = new AuthService();
