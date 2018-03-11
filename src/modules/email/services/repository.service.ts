import {Component, Inject, LoggerService} from '@nestjs/common';
import {Model} from 'mongoose';
import {EMAIL_VERIFY_FACTORY_TOKEN, EMAIL_VERIFY_TOKEN} from '../email.constants';
import {EmailVerify, EmailVerifyPayload} from '../email.interfaces';
import {APP_LOGGER_TOKEN} from '../../../constants/app.constants';
import {EmailVerifyDto} from '../email.dto';
import {DatabaseError} from '../../auth/exceptions/user.exception';

@Component()
export class RepositoryService {
  constructor(@Inject(EMAIL_VERIFY_TOKEN) private readonly _model: Model<EmailVerify>,
              @Inject(EMAIL_VERIFY_FACTORY_TOKEN) private readonly _factory,
              @Inject(APP_LOGGER_TOKEN) private readonly _logger: LoggerService) {
  }
  async create(data: EmailVerifyPayload): Promise<EmailVerifyDto> {
      const emailVerify = new this._model(data);
      return emailVerify.save().then(this._factory, err => {
          this._logger.error(err.message, err.stack);
          throw new DatabaseError(`Error create email verification model for user ${data._userId} with token ${data.token}`);
      });
  }
}
