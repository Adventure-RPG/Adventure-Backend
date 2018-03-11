import {Specification} from '../../database/interfaces/specification.interface';
import {User} from '../interfaces/user.interface';
import {CredentialsDto, RegisterDto} from '../dto/auth.dto';

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

    constructor(register: RegisterDto) {
        this.email = register.email;
    }

    specified(user: User): boolean {
        return this.email === user.email;
    }

    toClause() {
        return {email: {$eq: this.email}};
    }
}


export class FindAllSpecification implements Specification<User> {
    specified(T): boolean { return true; }

    toClause(): any { return {}; }

}