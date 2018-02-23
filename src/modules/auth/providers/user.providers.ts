import { Connection } from 'mongoose';
import { UserSchema } from '../schemas/user.schema';
import {USER_DTO_FACTORY_TOKEN, USER_MODEL_TOKEN} from '../constants/user.constants';
import {DB_CONNECTION_TOKEN} from '../../database/database.constants';
import {userDtoFactory} from '../dto/user.dto';

export const userProviders = [
    {
        provide: USER_MODEL_TOKEN,
        useFactory: (connection: Connection) => connection.model('User', UserSchema),
        inject: [DB_CONNECTION_TOKEN],
    },
    {
        provide: USER_DTO_FACTORY_TOKEN,
        useFactory: () => userDtoFactory,
    },
];