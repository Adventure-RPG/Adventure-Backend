import {Controller, Get, UseFilters} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {FindAllSpecification} from '../specifications/auth.specification';
import {UserExceptionFilter} from '../filters/user.filter';
import {ApiBearerAuth, ApiResponse} from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
@UseFilters(new UserExceptionFilter())
export class UserController {
  constructor(private _service: UserService) {}

  @Get()
  @ApiResponse({status: 200, description: 'Send all users info.'})
  @ApiResponse({status: 400, description: 'Error corrupted while processing'})
  findAll() {
    return this._service.query(new FindAllSpecification());
  }

}
