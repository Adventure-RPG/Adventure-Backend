import {Body, Controller, Post, UseFilters, UsePipes, ValidationPipe} from '@nestjs/common';
import {CredentialsDto, RegisterDto} from '../dto/auth.dto';
import {UserService} from '../services/user.service';
import {ByCredentialsSpecification} from '../specifications/auth.specification';
import {AuthService} from '../services/auth.service';
import {BadRequestException} from '@nestjs/common/exceptions/bad-request.exception';
import {AuthExceptionFilter} from '../filters/auth.filter';

@Controller('auth')
@UseFilters(new AuthExceptionFilter())
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private _user: UserService,
              private _auth: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    registerDto.password = await this._auth.hashPwd(registerDto.password);
    return this._user.create(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: CredentialsDto) {
    loginDto.password = await this._auth.hashPwd(loginDto.password);
    const users = await this._user.query(new ByCredentialsSpecification(loginDto));
    if (!users) { throw new BadRequestException('Not authorized.'); }
    return this._auth.createToken(users[0]);
  }
}
