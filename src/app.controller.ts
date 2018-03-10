import {Get, Controller, Inject, LoggerService} from '@nestjs/common';
import {APP_LOGGER_TOKEN} from './constants/app.constants';

@Controller()
export class AppController {

    constructor(@Inject(APP_LOGGER_TOKEN) private _logger: LoggerService) {
        this._logger.log('hello');
    }

	@Get()
	root(): string {
    return 'Hello World!';
  }
}
