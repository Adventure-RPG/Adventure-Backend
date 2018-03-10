import {Controller, Get, UseFilters} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {FindAllSpecification} from '../specifications/auth.specification';
import {UserExceptionFilter} from '../filters/user.filter';

@Controller('users')
@UseFilters(new UserExceptionFilter())
export class UserController {
  constructor(private _service: UserService) {}

  @Get()
  findAll() {
    return this._service.query(new FindAllSpecification());
  }

}
