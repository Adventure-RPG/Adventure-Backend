import {Feature} from "./Model";
import {Storage} from "../game/Storage";
import {Pool} from "pg";
import {SQLSpecification} from "../game/Specification";

class FeatureSQLStorage implements Storage<Feature> {
    constructor(private _pool: Pool) {}

    public persist(feature): void {
        this._pool.connect().then((client) => {
            client.query("INSERT INTO points(name, geo) VALUES ($1::text, " +
                "ST_GeomFromGeoJSON($2)) RETURNING id;", [feature.name, feature.geo]).then((id) => {
                client.release();
                feature.id = id;
            }).catch((err) => {
                console.error("Error running query.", err);
            });
        }).catch((err) => {
            console.error("Error fetching client from pool", err);
        });
    }

    public retrieve(spec: SQLSpecification<Feature>): Feature[] {
        this._pool.connect().then((client) => {
            client.query("SELECT ST_AsGeoJSON(lg.geo)::json As geometry, row_to_json(lp) " +
                "As properties FROM points As lg INNER JOIN (SELECT id, name from points) As lp ON lg.id = lp.id "
                + spec.toSqlClause()).then((res) => {
                client.release();
                let features = Array<Feature>();
                if (res.rowCount > 0) {
                    for (let row of res.rows) {
                        features.push(new Feature(row.properties.name, row.geometry, row.properties.id));
                    }
                }
                return features;
            }).catch((err) => {
                console.error("Error running query.", err);
            });
        }).catch((err) => {
            console.error("Error fetching client from pool", err);
        });
    }

    public modify(feature): void {
        this._pool.connect().then((client) => {
            client.query("UPDATE points SET geo = ST_GeomFromGeoJSON($1), name = $2::text WHERE id = $3;",
                [feature.geo, feature.name, feature.id]).then(() => {
                client.release();
            }).catch((err) => {
                console.error("Error running query.", err);
            });
        }).catch((err) => {
            console.error("Error fetching client from pool", err);
        });
    }

    public delete(feature): void {
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
