import {Component, Inject} from '@nestjs/common';
import {USER_DTO_FACTORY_TOKEN, USER_MODEL_TOKEN} from '../constants/user.constants';
import {Model} from 'mongoose';
import {User} from '../interfaces/user.interface';
import {UserDto} from '../dto/user.dto';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {Specification} from '../../database/interfaces/specification.interface';
import {CredentialsDto, RegisterDto} from '../dto/auth.dto';

@Component()
export class UserService {
  constructor(@Inject(USER_MODEL_TOKEN) private readonly _model: Model<User>,
              @Inject(USER_DTO_FACTORY_TOKEN) private readonly _factory) {}

  async create(_data: RegisterDto): Promise<UserDto> {
      const user = new this._model(_data);
      return await user.save().then(this._factory);
  }

  async query(spec: Specification<User>): Promise<UserDto[]> {
      return await this._model.find(spec.toClause()).exec().
        then((res: User[]) => res.map(user => this._factory(user)));
  }
}
