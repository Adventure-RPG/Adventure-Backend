import {Model, Identifiable, isIdentifiable} from "../game/Model";

export interface UserData extends Identifiable {
    id?: number;
    email: string;
    username: string;
    password: string;
    is_active: boolean;
}
// TODO: User Wrapper for Service view
export class User extends Model implements UserData {
    private _username: string;
    private _email: string;
    private _password: string;
    private _is_active: boolean;

    constructor(_id?: Identifiable);

    constructor(obj: UserData);

    constructor(obj: any) {
        if (isIdentifiable(obj)) {
            super(obj);
        } else {
            Object.assign(this, obj);
        }
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get is_active(): boolean {
        return this._is_active;
    }

    set is_active(value: boolean) {
        this._is_active = value;
    }

    get password() {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    equalbyCredentials(credentials: Credentials) {
        return (this.username === credentials.email) && (this.password === credentials.password);
    }
}

export interface Credentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}

export interface TokenCredentials {
    email: string;
}

export class UserFactory {
    createUser = (data: UserData) => new User(data);
    getInitialData = ():UserData => Object.create({is_active: false});
}

export const userFactory: UserFactory = new UserFactory();
