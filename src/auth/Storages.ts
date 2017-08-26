/**
 * Created by GolemXIV on 11.06.2017.
 */
import {User} from "./Model";
import {Storage} from "../game/Storage";
import {Observable} from "rxjs";
import { Pool } from "pg-rxjs";
import {Value} from "ts-json-properties";
import {SQLSpecification} from "../game/Specification";
import {List} from "../geojson/models";
import {Logger} from "../game/Errors";

export class UserSQLStorage implements Storage<User> {

    @Value("messages.users")
    private _messages;

    constructor(private _pool: Pool, private _logger: Logger) {}

    retrieve(spec: SQLSpecification<User>): Promise<List<User>> {
        let users = [];
        let obs = this._pool.query(spec.toSqlClause());
        return obs.toPromise().then(res => {
            if (res.rowCount > 0) {
                for (let row of res.rows) {
                    users.push(new User(row));
                }
            }
            return users;
        }).catch(err => {
            this._logger.error(this._messages, err.message, spec.toSqlClause(), err);
        });
    }

    modify(T): void { }

    delete(T): void { }

    public persist(user: User): Observable<User> {
        return this._pool.query(
            `INSERT INTO users(email, username, password, is_active) 
            VALUES ($1::text, $2::text, $3::text, $4::boolean) RETURNING id;`,
            [user.email, user.username, user.password, false]);
    }
}
