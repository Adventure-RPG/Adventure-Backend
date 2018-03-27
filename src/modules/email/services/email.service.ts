import {Component, Inject, LoggerService} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {SentMessageInfo} from 'nodemailer';
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
  private _connectedSuccessful: boolean = false;
  private _mailer: Mail;

  constructor(@Inject(APP_LOGGER_TOKEN) private _logger: LoggerService) {
    this.connect();
  }

  sendVerificationEmail(user: UserDto, verify: EmailVerifyDto) {
    const title = pug.renderFile(this._config.templateDir + 'title/' + this._config.templates.verify, {name: user.email, project: this._global.project});
    const html = pug.renderFile(this._config.templateDir + 'body/html/' + this._config.templates.verify, {name: user.email, link: this.generateVerifyLink(verify.token), project: this._global.project});
    const plain = pug.renderFile(this._config.templateDir + 'body/plain/' + this._config.templates.verify, {name: user.email, link: this.generateVerifyLink(verify.token), project: this._global.project});

    this.sendMail(user.email, title, html, plain);
  }

  async connect(): Promise<boolean> {
    this._mailer = nodemailer.createTransport(this._config.smtp.options, this._config.smtp.defaults);

    return new Promise<boolean>((resolve, reject) => {
        this._mailer.verify((err) => {
            if (err) {
                this._logger.warn(err.message);
                reject(err);
                this._connectedSuccessful = false;
            } else {
              this._connectedSuccessful = true;
              resolve(true);
            }
        });
    });
  }

  async sendMail(to, subject, html, text): Promise<SentMessageInfo> {
    if (!this._connectedSuccessful)
      await this.connect();
    return this._mailer.sendMail({to, subject, html, text});
  }

  generateVerifyLink(token: string) {
    return this._global.main + `/api/v1/confirm/${token}`;
  }
}
