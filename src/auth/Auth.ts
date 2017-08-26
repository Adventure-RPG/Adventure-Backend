/**
 * Created by GolemXIV on 11.06.2017.
 */
import * as jwt from "jsonwebtoken";
import {Value, Properties} from "ts-json-properties";
import {HashGenerator} from "./Hash";
import {TokenCredentials} from "./Model";

export class AuthService {

    @Value("settings.jwt")
    private _jwt;

    @Value("settings.crypto")
    private _crypto;

    private settings: any;

    constructor(private _hash: HashGenerator) {
        this.settings = Properties.getValue("settings");
    }

    public createToken(data: TokenCredentials): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(data, this._jwt.key, {expiresIn: this._jwt.expireIn}, (err, token) => {
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

    public createPassword(passwd: string): Promise<string> {
        return this._hash.encrypt(passwd);
    }

}

export const authService = new AuthService(new HashGenerator());
