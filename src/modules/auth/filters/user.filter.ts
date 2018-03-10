import {ExceptionFilter, Catch, NotFoundException} from '@nestjs/common';
import {AppException} from '../../../exceptions/app.exception';
import {DatabaseError} from '../exceptions/user.exception';

@Catch(DatabaseError)
export class UserExceptionFilter implements ExceptionFilter {

    catch(exception: AppException, response): any {
        const br = new NotFoundException(exception.message);

        response.status(br.getStatus()).json(br.getResponse());
    }
}
