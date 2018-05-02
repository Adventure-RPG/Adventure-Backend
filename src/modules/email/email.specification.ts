import {EmailVerify} from './email.interfaces';
import {Specification} from '../database/interfaces/specification.interface';

export class ByTokenSpecification implements Specification<EmailVerify> {
    token: string;

    constructor(token: string) {
        this.token = token;
    }

    specified(T): boolean {
        return this.token === T.token;
    }

    toClause(): any {
        return {token: {$eq: this.token}};
    }

}