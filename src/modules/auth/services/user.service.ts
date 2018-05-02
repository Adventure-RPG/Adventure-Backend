import {Component, Inject, LoggerService} from '@nestjs/common';
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
      return await user.save().then(this._factory, err => {
          this._logger.error(err.message, err.stack);
          throw new DatabaseError('Error create user with this credentials.');
      });
  }

  async findOne(userId): Promise<UserDto> {
      return this._model.findOne({ _id: userId }).then(res => this._factory(res), err => {
          this._logger.error(err.message, err.stack);
          throw new DatabaseError(`Error when querying user by id ${userId}`);
      });
  }


  async update(userId, params): Promise<UserDto> {
      return new Promise<UserDto>((resolve, reject) => {
          return this._model.findByIdAndUpdate(userId, params, (err, res) => {
              if (err) {
                  this._logger.error(err.message, err.stack);
                  reject(new DatabaseError(`Error when trying update user ${userId} with params ${params}`));
              } else {
                  resolve(res);
              }

          });
      });
  }

  async exists(spec: Specification<User>): Promise<boolean> {
      return await this._model.find(spec.toClause()).limit(1).then(res => !!res.length);
  }

  async query(spec: Specification<User>): Promise<UserDto[]> {
      return await this._model.find(spec.toClause()).exec()
          .then((res: User[]) => res.map(user => this._factory(user)), err => {
              this._logger.error(err.message, err.stack);
              throw new DatabaseError(`Error when querying by spec`);
          });
  }
}
