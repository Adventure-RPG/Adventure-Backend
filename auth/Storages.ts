/**
 * Created by GolemXIV on 11.06.2017.
 */
import {User} from "./Model";
import {Storage} from "../game/Storage";
import {Observable} from "rxjs";
import { Pool } from "pg-rxjs";
import {SQLSpecification} from "../game/Specification";

export class UserSQLStorage implements Storage<User> {
    constructor(private _pool: Pool) {}
    public async persist(user: User) {
        return this._pool.connect().map(client => client.query(`INSERT INTO users(email, username, password, is_active) VALUES 
                ($1::text, $2::text, $3::text, $4::bool) RETURNING id;`, [user.email, user.username, user.password, false]));
        try {
            let client = await this._pool.connect();
            try {
                let res = await
                client.release();
                return res;
            } catch(err) {
                console.error("Error fetching client from pool", err);
            }
        } catch (err){
            console.error("Error fetching client from pool", err);
        }
    }

    public async retrieve(spec: SQLSpecification<User>): Promise<GeoUserList> {
        let feature_list: GeoUserList = {type: "UserCollection", features: []};
        try {
            let client = await this._pool.connect();
            try {
                let res = await client.query(spec.toSqlClause());
                client.release();
                if (res.rowCount > 0) {
                    for (let row of res.rows) {
                        feature_list.features.push(new User(row).toGeoJson());
                    }
                }
                return feature_list;
            } catch (err) {
                console.error(err);
            }
        } catch (err) {
            console.error(err);
        }
    }

    public async modify(feature: User) {
        console.log(feature);
        this._pool.connect().then((client) => {
            client.query("UPDATE points SET geo = ST_GeomFromGeoJSON($1), name = $2::text WHERE id = $3;",
                [feature.geo, feature.name, feature.id]).then(() => {
                client.release();
                return feature;
            }).catch((err) => {
                console.error("Error running query.", err);
            });
        }).catch((err) => {
            console.error("Error fetching client from pool", err);
        });
    }

    public delete(feature: User): void {
        this._pool.connect().then((client) => {
            client.query("DELETE FROM points WHERE id = $1;", [feature.id]).then(() => {
                client.release();
            }).catch((err) => {
                console.error("Error running query.", err);
            });
        }).catch((err) => {
            console.error("Error fetching client from pool", err);
        });
    }
}
