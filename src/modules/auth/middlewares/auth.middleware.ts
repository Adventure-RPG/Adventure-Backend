import {ExpressMiddleware, HttpException, HttpStatus, Middleware, NestMiddleware, Request} from '@nestjs/common';
import {AuthService} from '../services/auth.service';

@Middleware()
export class AuthMiddleware implements NestMiddleware {

    constructor(private _service: AuthService) {}

    async resolve(...args: any[]): Promise<ExpressMiddleware> {
        return async (req, res, next) => {
          try {
              const authHeader = req.headers.authorization.split(' ');
              await this._service.validateToken(authHeader[authHeader.length - 1]);
          } catch (Exception) {
              throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
          }
          next();
        };
    }
}