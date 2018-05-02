import {Component, Inject, LoggerService} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {SentMessageInfo} from 'nodemailer';
import {Config} from '../../../app.util';
import * as Mail from 'nodemailer/lib/mailer';
import {APP_LOGGER_TOKEN} from '../../../constants/app.constants';
import {UserDto} from '../../auth/dto/user.dto';
import {EmailVerifyDto} from '../email.dto';
import {Message} from '../email.models';
import * as pug from 'pug';

@Component()
export class EmailService {
  @Config('global')
  private _global;

  @Config('email')
  private _config;
  private _mailer: Mail;
  private _messages: Message[] = [];
  private _connectionTimeout = 10000;

  constructor(@Inject(APP_LOGGER_TOKEN) private _logger: LoggerService) {
    this.connect();
  }

  sendVerificationEmail(user: UserDto, verify: EmailVerifyDto) {
    const subject = pug.renderFile(this._config.templateDir + 'title/' + this._config.templates.verify, {name: user.email, project: this._global.project});
    const html = pug.renderFile(this._config.templateDir + 'body/html/' + this._config.templates.verify, {name: user.email, link: this.generateVerifyLink(verify.token), project: this._global.project});
    const text = pug.renderFile(this._config.templateDir + 'body/plain/' + this._config.templates.verify, {name: user.email, link: this.generateVerifyLink(verify.token), project: this._global.project});
    this._messages.push({to: user.email, subject, html, text});
    this.sendMessages();
  }

  async connect() {
      this._mailer = nodemailer.createTransport(this._config.smtp.options, this._config.smtp.defaults);
      this._mailer.on('idle', () => {
          this.sendMessages();
      });

      this.verify().catch(() => setTimeout(() => this.connect(), this._connectionTimeout));
  }

  async verify(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        this._mailer.verify((err) => {
            if (err) {
                this._logger.warn(err.message);
                reject(err);
            } else {
              this._logger.log(`Connected to mail server ${this._config.smtp.options.host}:${this._config.smtp.options.port}.`);
              resolve(true);
            }
        });
    });
  }

  async sendMail(msg: Message): Promise<SentMessageInfo> {
    return this._mailer.sendMail(msg)
        .then(res => this._logger.log(`Message ${res} sended successful to ${msg.to}.`))
        .catch(err => this._logger.warn(err.message));
  }

  async sendMessages() {
      while (this._mailer.isIdle() && this._messages.length)
          this.sendMail(this._messages.shift());
      if (!this._mailer.isIdle()) {
          this._mailer.close();
          this.connect();
      }
  }

  generateVerifyLink(token: string) {
    return this._global.main + `/api/v1/confirm/${token}`;
  }
}
