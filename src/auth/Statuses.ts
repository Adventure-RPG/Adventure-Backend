/**
 * Created by GolemXIV on 12.06.2017.
 */
import { ReferencedResource } from "typescript-rest";
import { Errors } from "typescript-rest";

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

export class BadRequestError extends Errors.BadRequestError {
    static statusCode: number = 400;
}

export class UnAuthorized extends Errors.UnauthorizedError {
    static statusCode: number = 401;
}
