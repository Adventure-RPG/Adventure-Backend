/**
 * Created by GolemXIV on 11.06.2017.
 */
import * as jwt from "jsonwebtoken";
import {Value, Properties} from "ts-json-properties";
import {Observable} from "rxjs";
import * as fs from "fs";

let c = 0;
export class AuthService {
    private settings: any;

    constructor() {
        this.settings = Properties.getValue("settings");
    }

    public createToken(email: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let payload = {email: email};
            jwt.sign(payload, this.settings.key, {expiresIn: 60 * 60}, (err, token) => { if (err) {
                    reject(err);
               } else {
                   resolve(token);
               }
           });
        });
    }

    public verifyToken(token: string): Promise<boolean> {
        let callback = (err, decoded) => !err || decoded;
        jwt.verify(token, this.settings.key, callback);
        return new Promise(callback);
    }

    public createHash(password: string): Promise<string> {
        return new Promise(()=> password);
    }
}

export const authService = new AuthService();
