import {Component, LoggerService} from '@nestjs/common';
import * as winston from 'winston';
import {LoggerInstance} from 'winston';
import {Config} from './app.util';
import {TransportInstance} from 'winston';

// TODO: make a single instance over all application
@Component()
export class AppLogger implements LoggerService {
    @Config('logging')
    private _config: any;

    private _logger: LoggerInstance;

    constructor() {
        this._logger = new winston.Logger({
            level: this._config.level,
            transports: this._buildTransports(this._config.transports),
        });
    }

    private _buildTransports(transportsCfg: any): TransportInstance[] {
        const transports = [];
        transports.push(...transportsCfg.console.map(cfg => new winston.transports.Console(cfg)));
        transports.push(...transportsCfg.file.map(cfg => new winston.transports.File(cfg)));
        transports.push(...transportsCfg.http.map(cfg => new winston.transports.Http(cfg)));
        return transports;
    }

    log(message: string): void {
        this._logger.info(message);
    }

    error(message: string, trace: string): void {
        this._logger.error(message);
    }

    warn(message: string): void {
        this._logger.warn(message);
    }

}