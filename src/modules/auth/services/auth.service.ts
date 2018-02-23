import { Component } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {Config} from '../../../app.util';
import {UserDto} from '../dto/user.dto';

@Component()
export class AuthService {

  @Config('jwt')
  private _config;

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

  async validate(token: string): Promise<string|object> {
    return new Promise((resolve, reject) => jwt.verify(token, this._config.secretKey, (err, decoded) => {
        if (err) reject(err);
        if (!decoded) reject(new Error('unable to decode'));
        resolve(decoded);
    }));
  }

}
