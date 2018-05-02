import {Body, Controller, Post, UseFilters, UsePipes, ValidationPipe} from '@nestjs/common';
import {CredentialsDto, RegisterDto} from '../dto/auth.dto';
import {UserService} from '../services/user.service';
import {ByCredentialsSpecification, ByEmailSpecification} from '../specifications/auth.specification';
import {AuthService} from '../services/auth.service';
import {BadRequestException} from '@nestjs/common/exceptions/bad-request.exception';
import {AuthExceptionFilter} from '../filters/auth.filter';
import {EmailService} from '../../email/services/email.service';
import {UnauthorizedException} from '@nestjs/common/exceptions/unauthorized.exception';
import {RepositoryService as EmailRepositoryService} from '../../email/services/repository.service';

@Controller('auth')
@UseFilters(new AuthExceptionFilter())
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly _user: UserService,
              private readonly _auth: AuthService,
              private readonly _emailRep: EmailRepositoryService,
              private readonly _emailService: EmailService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const exists = await this._user.exists(new ByEmailSpecification(registerDto));
    if (exists) { throw new BadRequestException('User already registered.')}

    registerDto.password = await this._auth.hashPwd(registerDto.password);
    const user = await this._user.create(registerDto);
    const emailVerify = await this._emailRep.create({_userId: user._id, token: await this._auth.generateToken()});
    this._emailService.sendVerificationEmail(user, emailVerify);
    return user;
  }

  @Post('login')
  async login(@Body() loginDto: CredentialsDto) {
    loginDto.password = await this._auth.hashPwd(loginDto.password);
    const users = await this._user.query(new ByCredentialsSpecification(loginDto));
    if (!users.length) { throw new UnauthorizedException('Your account are not found.'); }
    const user = users[0];
    if (!user.is_active) throw new UnauthorizedException('Your account has not been verified yet.');
    return this._auth.createToken(user);
  }
}
