import {Component, Inject, Logger, LoggerService} from '@nestjs/common';
import {USER_DTO_FACTORY_TOKEN, USER_MODEL_TOKEN} from '../constants/user.constants';
import {Model} from 'mongoose';
import {User} from '../interfaces/user.interface';
import {UserDto} from '../dto/user.dto';
import {Specification} from '../../database/interfaces/specification.interface';
import {RegisterDto} from '../dto/auth.dto';
import {APP_LOGGER_TOKEN} from '../../../constants/app.constants';
import {DatabaseError} from '../exceptions/user.exception';

@Component()
export class UserService {
  constructor(@Inject(USER_MODEL_TOKEN) private readonly _model: Model<User>,
              @Inject(USER_DTO_FACTORY_TOKEN) private readonly _factory,
              @Inject(APP_LOGGER_TOKEN) private readonly _logger: LoggerService,
  ) {
  }

  async create(_data: RegisterDto): Promise<UserDto> {
      const user = new this._model(_data);
      return await user.save().then(res => {
          if (res) return this._factory(res);
      }, err => {
          this._logger.error(err.message, err.stack);
          throw new DatabaseError('Error create user with this credentials.');
      });
  }

  async query(spec: Specification<User>): Promise<UserDto[]> {
      return await this._model.find(spec.toClause()).exec()
          .then((res: User[]) => res.map(user => this._factory(user)), err => {
              this._logger.error(err.message, err.stack);
              throw new DatabaseError(`Error when querying by spec`);
          });
  }
}
