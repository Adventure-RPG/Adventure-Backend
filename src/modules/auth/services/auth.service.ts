import {Component, Inject, LoggerService} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {Config} from '../../../app.util';
import {UserDto} from '../dto/user.dto';
import {pbkdf2, randomBytes} from 'crypto';
import {HashError, TokenError} from '../exceptions/auth.exception';
import {APP_LOGGER_TOKEN} from '../../../constants/app.constants';

@Component()
export class AuthService {

  @Config('jwt')
  private _config;

  @Config('crypto')
  private _hashConfig;

  constructor(@Inject(APP_LOGGER_TOKEN) private readonly _logger: LoggerService) {}

  async createToken(user: UserDto) {
    return new Promise((resolve, reject) => jwt.sign(user, this._config.secretKey, this._config.options,
(err, token) => {
         if (err) {
             this._logger.error(err.message, err.stack);
             reject(new TokenError('Error in token processing.'));
         }
         if (!token) {
             this._logger.warn(`unable to create token for user ${JSON.stringify(user)}.`);
             reject(new TokenError('Unable to create token.'));
         }
         resolve({access_token: token});
        }),
    );
  }

  async validateToken(token: string): Promise<string|object> {
    return new Promise((resolve, reject) => jwt.verify(token, this._config.secretKey, (err, decoded) => {
        if (err) {
            this._logger.error(err.message, err.stack);
            reject(new TokenError('Error in token validating.'));
        }
        if (!decoded) {
            this._logger.warn(`unable to decode token ${token}`);
            reject(new TokenError('unable to decode'));
        }
        resolve(decoded);
    }));
  }

  async validate(payload) {
      return new Promise((resolve, reject) => {
          if (!payload || !payload.email || !payload.exp) {
              this._logger.warn(`Invalid payload ${JSON.stringify(payload)}`);
              reject(new TokenError('Invalid payload.'));
          }
          if (payload.exp > new Date().getTime() - this._config.options.expiresIn) resolve(false);
          resolve(true);
      });
  }

  async hashPwd(pwd: string): Promise<string> {
    return new Promise<string>((resolve, reject) =>
        pbkdf2(pwd, this._hashConfig.salt, this._hashConfig.iterations, this._hashConfig.keylen, this._hashConfig.digest,
            (err, derivedKey) => {
                if (err) {
                    this._logger.error(err.message, err.stack);
                    reject(new HashError('Error when processing password.'));
                }
                if (!derivedKey) {
                    this._logger.warn(`unable to hash password: ${pwd}`);
                    reject(new HashError('Unable to hashing password.'));
                }
                resolve(derivedKey.toString('hex'));
            }));
    }

    async generateToken(size: number = 16): Promise<string> {
      return new Promise<string>(((resolve, reject) => randomBytes(size, (err, buf) => {
          if (err) {
              this._logger.error(err.message, err.stack);
              reject(new TokenError('Error when generate random token'));
          }
          if (!buf) {
              this._logger.warn('randomBytes buffer returns null');
              reject(new TokenError('buffer not generated.'));
          }
          resolve(buf.toString('hex'));
      })));
    }

}
