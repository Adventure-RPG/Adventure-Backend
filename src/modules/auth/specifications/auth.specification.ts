import {Specification} from '../../database/interfaces/specification.interface';
import {User} from '../interfaces/user.interface';
import {CredentialsDto, SendDto} from '../dto/auth.dto';

export class ByCredentialsSpecification implements Specification<User> {
    email: string;
    password: string;

    constructor(credentials: CredentialsDto) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    specified(user: User): boolean {
        return this.email === user.email && this.password === user.password;
    }

    toClause() {
        return {email: {$eq: this.email}, password: {$eq: this.password}};
    }
}

export class ByEmailSpecification implements Specification<User> {
    email: string;

    constructor(send: SendDto) {
        this.email = send.email;
    }

    specified(user: User): boolean {
        return this.email === user.email;
    }

    toClause() {
        return {email: {$eq: this.email}};
    }
}


export class BySendSpecification implements Specification<User> {
    email: string;
    is_active: boolean;

    constructor(send: SendDto) {
        this.email = send.email;
        this.is_active = false;
    }

    specified(user: User): boolean {
        return this.email === user.email && this.is_active === user.is_active;
    }

    toClause(): any {
        return {email: {$eq: this.email}, is_active: {$eq: this.is_active}};
    }

}

export class FindAllSpecification implements Specification<User> {
    specified(T): boolean { return true; }

    toClause(): any { return {}; }

}