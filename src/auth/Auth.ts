/**
 * Created by GolemXIV on 11.06.2017.
 */
import * as jwt from "jsonwebtoken";
import {Value, Properties} from "ts-json-properties";
import {HashGenerator} from "./Hash";
import {TokenCredentials} from "./Model";
import {Logger} from "../game/Errors";
import {toPromise} from "../game/utils";

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
        return toPromise(jwt.sign, data, this._jwt.key, {expiresIn: this._jwt.expireIn});
    }

    public verifyToken(token: string): Promise<boolean> {
        return toPromise(jwt.verify, token, this._jwt.key);

    }

    public createPassword(passwd: string): Promise<string> {
        return this._hash.encrypt(passwd);
    }

}

export const authService = new AuthService(new HashGenerator(new Logger("hash")));
