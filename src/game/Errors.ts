/**
 * Created by GolemXIV on 05.08.2017.
 */
import {HttpError} from "typescript-rest";
import {Request, Response, NextFunction} from "express";

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
