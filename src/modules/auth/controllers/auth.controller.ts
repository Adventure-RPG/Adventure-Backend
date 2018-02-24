import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
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
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterDto) {
    registerDto.password = await this._auth.hashPwd(registerDto.password);
    return this._user.create(registerDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: CredentialsDto) {
    loginDto.password = await this._auth.hashPwd(loginDto.password);
    const users = await this._user.query(new ByCredentialsSpecification(loginDto));
    if (!users) {
      throw new BadRequestException('Not authorized.');
    }
    return this._auth.createToken(users[0]);
  }
}
