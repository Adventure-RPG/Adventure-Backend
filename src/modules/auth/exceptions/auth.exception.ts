import {AppException} from '../../../exceptions/app.exception';

export class HashError extends AppException {
    constructor(msg?: string) {
        super(msg);
    }
}

export class TokenError extends AppException {
    constructor(msg?: string) {
        super(msg);
    }
}