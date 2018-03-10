import {AppException} from '../../../exceptions/app.exception';

export class DatabaseError extends AppException {
    constructor(msg?: string) {
        super(msg);
    }
}
