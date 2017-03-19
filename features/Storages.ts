import {Feature} from "./Model";
import {Storage} from "../game/Storage";
import {Pool} from "pg";
import {SQLSpecification} from "../game/Specification";
import * as winston from "winston";

export class FeatureSQLStorage implements Storage<Feature> {
    constructor(private _pool: Pool) {}

    public persist(feature): void {
        this._pool.connect().then((client) => {
            client.query("INSERT INTO points(name, geo) VALUES ($1::text, " +
                "ST_GeomFromGeoJSON($2)) RETURNING id;", [feature.name, feature.geo]).then((id) => {
                client.release();
                feature.id = id;
            }).catch((err) => {
                winston.error("Error running query.", err);
            });
        }).catch((err) => {
            winston.error("Error fetching client from pool", err);
        });
    }

    public retrieve(spec: SQLSpecification<Feature>): Promise<Feature[]> {
        let features = Array<Feature>();
        return this._pool.connect().then((client) => {
            client.query(spec.toSqlClause()).then((res) => {
                client.release();
                if (res.rowCount > 0) {
                    for (let row of res.rows) {
                        features.push(new Feature(row.properties.name, row.geometry, row.properties.id));
                    }
                }
                return features;
            }).catch((err) => {
                winston.error("Error running query.", err);
                return features;
            });
        }).catch((err) => {
            winston.error("Error fetching client from pool", err);
            return features;
        });
    }

    public modify(feature): void {
        this._pool.connect().then((client) => {
            client.query("UPDATE points SET geo = ST_GeomFromGeoJSON($1), name = $2::text WHERE id = $3;",
                [feature.geo, feature.name, feature.id]).then(() => {
                client.release();
            }).catch((err) => {
                winston.error("Error running query.", err);
            });
        }).catch((err) => {
            winston.error("Error fetching client from pool", err);
        });
    }

    public delete(feature): void {
        this._pool.connect().then((client) => {
            client.query("DELETE FROM points WHERE id = $1;", [feature.id]).then(() => {
                client.release();
            }).catch((err) => {
                winston.error("Error running query.", err);
            });
        }).catch((err) => {
            winston.error("Error fetching client from pool", err);
        });
    }
}
