import {Model, Identifiable, isIdentifiable} from "../game/Model";

export class User extends Model {
    private _username: string;
    private _email: string;
    private _password: string;
    private _is_active: boolean;

    constructor(_id?: Identifiable);

    constructor(obj: {email: string, username: string, password: string, is_active: boolean});

    constructor(obj: any) {
        if (isIdentifiable(obj)) {
            super(obj);
        } else {
            if(obj.id) {
                super(obj.id);
            }
            this.username = obj.username;
            this.email = obj.email;
            this.password = obj.password;
            this.is_active = obj.is_active;
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