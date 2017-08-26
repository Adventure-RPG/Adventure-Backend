import * as crypto from "crypto";
import {Value} from "ts-json-properties";

export class HashGenerator {

    @Value("settings.crypto")
    private _crypt_settings;

    public encrypt(str: string): Promise<string> {
        return new Promise((resolve, reject)=> {
            crypto.randomBytes(this._crypt_settings.saltBytes, (err, salt)=> {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                crypto.pbkdf2(str, salt, this._crypt_settings.iterations, this._crypt_settings.hashBytes,
                    this._crypt_settings.digest, (er, hash)=> {
                        if (er) {
                            console.log(er);
                            reject(er);
                        }
                        resolve(hash.toString("base64"));
                    });
            });
        });
    }
}
