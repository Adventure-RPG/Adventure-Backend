import * as mongoose from 'mongoose';
import {config} from '../../app.util';
import {DB_CONNECTION_TOKEN} from './database.constants';

export const databaseProviders = [
    {
        provide: DB_CONNECTION_TOKEN,
        useFactory: async () => {
            (mongoose as any).Promise = global.Promise;
            return await mongoose.connect(config.db.name);
        },
    },
];