import * as crypto from "crypto";
import {Value} from "ts-json-properties";
import {Logger} from "../game/Errors";
import {toPromise} from "../game/utils";

export class HashGenerator {

    @Value("settings.crypto")
    private _settings;

    @Value("messages.hash")
    private _messages;

    constructor(private _logger: Logger) {}

    public encrypt(str: string): Promise<string> {
        return new Promise((resolve, reject) => {
            return this.generateSalt(this._settings.saltBytes).then(salt => {
                return this.generateHash(str, salt).then(hash => {
                    resolve(this.fmtHash(hash));
                    this._logger.log("info", this._messages.messages.HASH_GENERATE_COMPLETE,
                        hash.toString(), salt.toString());
                }).catch(err => {
                    this._logger.error(this._messages.errors.HASH_GENERATE_ERROR, err.message, err);
                    reject(err);
                });
            }).catch(err => {
                this._logger.error(this._messages.errors.SALT_GENERATE_ERROR, err.message, err);
                reject(err);
            });
        });
    }

    private generateSalt(saltBytes: number): Promise<Buffer> {
        return toPromise<Buffer>(crypto.randomBytes, saltBytes);
    }

    private generateHash(str: string | Buffer, salt: string | Buffer): Promise<Buffer> {
        return toPromise<Buffer>(
            crypto.pbkdf2,
            str,
            salt,
            this._settings.iterations,
            this._settings.hashBytes,
            this._settings.digest,
        );
    }

    private fmtHash = (hash: Buffer): string => hash.toString(this._settings.fmt);
}
