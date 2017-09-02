import {UnAuthorized} from "./Statuses";

export function AuthRequired(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value; // save a reference to the original method

    descriptor.value = function(...args: any[]) {
        let token = this.context.request.header("Authorization");
        if (!token) { throw new UnAuthorized(this._messages.errors.USER_MISSING_TOKEN_ERROR); }

        return this.auth.verifyToken(token).then(resolve => {
            return originalMethod.apply(this, args);
        }).catch(err => {
            this._logger.error(this._messages.errors.USER_INVALID_TOKEN_ERROR, err.message, err);
            throw new UnAuthorized(this._messages.errors.USER_INVALID_TOKEN_ERROR);
        });
    };
    return descriptor;
}
