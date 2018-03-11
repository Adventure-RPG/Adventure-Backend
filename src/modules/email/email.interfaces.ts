import {Model} from '../database/interfaces/model.interface';

export interface EmailVerify extends Model {
    readonly _userId: any;
    readonly token: string;
    readonly createdAt: Date;
}

export interface EmailVerifyPayload {
    readonly _userId: any;
    readonly token: string;
}