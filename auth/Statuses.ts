/**
 * Created by GolemXIV on 12.06.2017.
 */
import { ReferencedResource } from "typescript-rest";
import { HttpError } from "typescript-rest";

export class AcceptResource extends ReferencedResource {
    static statusCode: number = 200;
    constructor(body: any) {
        super("", AcceptResource.statusCode, body);
    }
}

export class CreateResource extends ReferencedResource {
    static statusCode: number = 201;
    constructor(body: any) {
        super("", AcceptResource.statusCode, body);
    }
}

export class BadRequestError extends HttpError {
    static statusCode: number = 400;
    constructor(message: string) {
        super("BadRequest", BadRequestError.statusCode, message);
    }
}


export class UnAuthorized extends HttpError {
    static statusCode: number = 401;
    constructor(message: string) {
        super("UnAuthorized", UnAuthorized.statusCode, message);
    }
}