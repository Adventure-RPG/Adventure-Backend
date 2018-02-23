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

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const pwd = await this._auth.hashPwd(registerDto.password);
    return this._user.create({email: registerDto.email, password: pwd});
  }

  @Post('login')
  async login(@Body() loginDto: CredentialsDto) {
    const pwd = await this._auth.hashPwd(loginDto.password);
    const users = await this._user.query(new ByCredentialsSpecification({email: loginDto.email, password: pwd}));
    if (!users) {
      throw new BadRequestException('Not authorized.');
    }
    return this._auth.createToken(users[0]);
  }
}
