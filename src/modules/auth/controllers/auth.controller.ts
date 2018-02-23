import {Body, Controller, Post} from '@nestjs/common';
import {CredentialsDto, RegisterDto} from '../dto/auth.dto';
import {UserService} from '../services/user.service';
import {ByCredentialsSpecification} from '../specifications/auth.specification';
import {AuthService} from '../services/auth.service';
import 'rxjs/add/observable/from';
import {BadRequestException} from '@nestjs/common/exceptions/bad-request.exception';

@Controller('auth')
export class AuthController {
  constructor(private _user: UserService, private _auth: AuthService) {}

  @Post()
  register(@Body() registerDto: RegisterDto) {
      return this._user.create({email: registerDto.email, password: registerDto.password});
  }

  @Post('login')
  async login(@Body() loginDto: CredentialsDto) {
    const users = await this._user.query(new ByCredentialsSpecification(loginDto));
    if (!users) {
      throw new BadRequestException('Not authorized.');
    }
    return this._auth.createToken(users[0]);
  }
}
