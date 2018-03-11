import {Connection} from 'mongoose';
import {DB_CONNECTION_TOKEN} from '../database/database.constants';
import {EmailVerifySchema} from './emai.schemas';
import {EMAIL_VERIFY_FACTORY_TOKEN, EMAIL_VERIFY_TOKEN} from './email.constants';
import {emailVerifyDtoFactory} from './email.dto';

export const emailProviders = [
    {
        provide: EMAIL_VERIFY_TOKEN,
        useFactory: (connection: Connection) => connection.model('EmailVerify', EmailVerifySchema),
        inject: [DB_CONNECTION_TOKEN],
    },
    {
        provide: EMAIL_VERIFY_FACTORY_TOKEN,
        useFactory: () => emailVerifyDtoFactory,
    },
];