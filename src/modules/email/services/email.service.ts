import {Component, Inject, LoggerService} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {Config} from '../../../app.util';
import * as Mail from 'nodemailer/lib/mailer';
import {APP_LOGGER_TOKEN} from '../../../constants/app.constants';
import {UserDto} from '../../auth/dto/user.dto';
import {EmailVerifyDto} from '../email.dto';
import * as pug from 'pug';

@Component()
export class EmailService {
  @Config('global')
  private _global;

  @Config('email')
  private _config;
  private _mailer: Mail;

  constructor(@Inject(APP_LOGGER_TOKEN) private _logger: LoggerService) {
    this._mailer = nodemailer.createTransport(this._config.smtp.options, this._config.smtp.defaults);

    // TODO: make a waiting function for mail service
    this._mailer.verify((err) => {
        if (err) this._logger.warn(err.message);
    });
  }

  sendVerificationEmail(user: UserDto, verify: EmailVerifyDto) {
    const title = pug.renderFile(this._config.templateDir + 'title/' + this._config.templates.verify, {name: user.email, project: this._global.project});
    const html = pug.renderFile(this._config.templateDir + 'body/html/' + this._config.templates.verify, {name: user.email, link: this.generateVerifyLink(verify.token), project: this._global.project});
    const plain = pug.renderFile(this._config.templateDir + 'body/plain/' + this._config.templates.verify, {name: user.email, link: this.generateVerifyLink(verify.token), project: this._global.project});

    this._mailer.sendMail({to: user.email, subject: title, html, text: plain});
  }

  generateVerifyLink(token: string) {
    return this._global.main + `/api/v1/confirm/${token}`;
  }
}
