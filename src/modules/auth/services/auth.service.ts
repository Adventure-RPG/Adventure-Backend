import { Component } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {Config} from '../../../app.util';
import {UserDto} from '../dto/user.dto';
import {pbkdf2} from 'crypto';

@Component()
export class AuthService {

  @Config('jwt')
  private _config;

  @Config('crypto')
  private _hashConfig;

  constructor() {}

  async createToken(user: UserDto) {
    return new Promise((resolve, reject) => jwt.sign(user, this._config.secretKey, this._config.options,
(err, token) => {
         if (err) reject(err);
         if (!token) reject(new Error('unable to create token'));
         resolve({access_token: token});
        }),
    );
  }

  async validateToken(token: string): Promise<string|object> {
    return new Promise((resolve, reject) => jwt.verify(token, this._config.secretKey, (err, decoded) => {
        if (err) reject(err);
        if (!decoded) reject(new Error('unable to decode'));
        resolve(decoded);
    }));
  }

  async validate(payload) {
      return new Promise((resolve, reject) => {
          if (!payload || !payload.email || !payload.exp) reject(new Error('Invalid payload'));
          if (payload.exp > new Date().getTime() - this._config.options.expiresIn) resolve(false);
          resolve(true);
      });
  }

  async hashPwd(pwd: string): Promise<string> {
    return new Promise<string>((resolve, reject) =>
        pbkdf2(pwd, this._hashConfig.salt, this._hashConfig.iterations, this._hashConfig.keylen, this._hashConfig.digest,
            (err, derivedKey) => {
                if (err) reject(err);
                if (!derivedKey) reject(new Error('unable to hash password'));
                resolve(derivedKey.toString('hex'));
            }));
    }

}
