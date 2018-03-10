import {APP_LOGGER_TOKEN} from '../constants/app.constants';
import {AppLogger} from '../app.logger';

export const appProviders = [
    {
        provide: APP_LOGGER_TOKEN,
        useClass: AppLogger,
    },
];