import {ExceptionFilter, Catch, BadRequestException} from '@nestjs/common';
import {HashError, TokenError} from '../exceptions/auth.exception';
import {AppException} from '../../../exceptions/app.exception';
import {DatabaseError} from '../exceptions/user.exception';

@Catch(HashError, TokenError, DatabaseError)
export class AuthExceptionFilter implements ExceptionFilter {

    catch(exception: AppException, response): any {
        const br = new BadRequestException(exception.message);

        response.status(br.getStatus()).json(br.getResponse());
    }
}


