/**
 * Created by GolemXIV on 05.08.2017.
 */
import {HttpError} from "typescript-rest";
import {Request, Response, NextFunction} from "express";
import * as winston from "winston";

export const errorHandler =  (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        if (res.headersSent) { // important to allow default error handler to close connection if headers already sent
            return next(err);
        }
        res.set("Content-Type", "application/json");
        res.status(err.statusCode);
        res.json({message : err.message, code: err.statusCode});
    } else {
        next(err);
    }
};

export class Logger {

    @Value("logging")
    private _settings;

    private _logger: winston.LoggerInstance;

    constructor(private _name: string, logger?: winston.LoggerInstance) {
        let transports = [];
        let settings: {key: string, val: any} = this._settings[_name];
        for (let key in settings) {
            transports.push(this.getTransport(_name, key));
        }

        this._logger = logger ? logger : new (winston.Logger)({transports});
    };

    get logger(): winston.LoggerInstance {
        return this._logger;
    }

    getTransport(name: string, type: string): winston.TransportInstance {
        return new (winston.transports[this.toTransportName(type)])(this._settings[name][type]);
    }

    toTransportName = (name: string): string => name.substr(0, 1).toUpperCase() + name.substr(1);

    log: winston.LogMethod = (level: string, msg: string, ...meta: any[]) => this._logger[level](msg, ...meta);

    error: winston.LeveledLogMethod = (msg: string, ...meta: any[]) => this._logger.error(msg, ...meta);

}
