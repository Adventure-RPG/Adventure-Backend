import {EmailVerify} from './email.interfaces';

export class EmailVerifyDto {
    readonly token: string;
    readonly createdAt: Date;
    // TODO: add expireAt to properties

    constructor(emailVerify: EmailVerify) {
        this.token = emailVerify.token;
        this.createdAt = emailVerify.createdAt;
    }
}

export const emailVerifyDtoFactory = (emailVerify: EmailVerify): EmailVerifyDto => new EmailVerifyDto(emailVerify);