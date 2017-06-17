import {SQLSpecification} from "../game/Specification";
import {User} from "./Model";

export class BySQLSpecification implements SQLSpecification<User> {

    public specified(feature) {
        return true;
    }

    public toSqlClause(): string {
        return "SELECT * FROM users";
    }

}

export class ByIdSpecification extends BySQLSpecification implements SQLSpecification<User> {

    constructor(private _id) { super(); }

    public specified(user) {
        return this._id === user.id;
    }

    public toSqlClause() {
        return super.toSqlClause() + `WHERE id = ${this._id}`;
    }
}

export class ByCredentialsSpecification extends BySQLSpecification implements SQLSpecification<User> {
    constructor(private _email: string, private _password: string) { super(); }

    public specified(user) {
        return user.equalbyCredentials(this._email, this._password);
    }

    public toSqlClause() {
        return super.toSqlClause() + ` WHERE email = '${this._email}' AND password = crypt('${this._password}', password)`;
    }
}
