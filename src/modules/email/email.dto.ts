import {EmailVerify} from './email.interfaces';

export class EmailVerifyDto {
    readonly _userId: any;
    readonly token: string;
    readonly createdAt: Date;
    // TODO: add expireAt to properties

    constructor(emailVerify: EmailVerify) {
        this._userId = emailVerify._userId;
        this.token = emailVerify.token;
        this.createdAt = emailVerify.createdAt;
    }

    toJSON() {
        return {
            token: this.token,
            createdAt: this.createdAt,
        };
    }
}

export const emailVerifyDtoFactory = (emailVerify: EmailVerify): EmailVerifyDto => new EmailVerifyDto(emailVerify);