import {Body, Controller, Get, Post} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {RegisterDto} from '../dto/auth.dto';
import {FindAllSpecification} from '../specifications/auth.specification';

@Controller('users')
export class UserController {
  constructor(private _service: UserService) {}

  @Get()
  findAll() {
    return this._service.query(new FindAllSpecification());
  }

}
