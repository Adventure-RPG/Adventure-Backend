import {Feature} from "./Model";
import {Storage} from "../game/Storage";
import {Pool} from "pg";
import {SQLSpecification} from "../game/Specification";
import * as winston from "winston";
import {GeoFeature, GeoFeatureList} from "../geojson/models";

export class FeatureSQLStorage implements Storage<Feature> {
    constructor(private _pool: Pool) {}

    public async persist(feature) {
        try {
            let client = await this._pool.connect();
            try {
                let res = await client.query(`INSERT INTO points(name, geo) VALUES 
                ($1::text, ST_GeomFromGeoJSON($2)) RETURNING id;`, [feature.name, feature.geo])
                client.release();
                console.log(res);
                return res;
            } catch(err) {
                winston.error("Error fetching client from pool", err);
            }
        } catch (err){
            winston.error("Error fetching client from pool", err);
        }
    }

    public async retrieve(spec: SQLSpecification<Feature>): Promise<GeoFeatureList<Feature>> {
        let features: GeoFeatureList<Feature> = [];
        try {
            let client = await this._pool.connect();
            try {
                let res = await client.query(spec.toSqlClause());
                client.release();
                if (res.rowCount > 0) {
                    for (let row of res.rows) {
                        features.push(new Feature(row.properties.name, row.geometry, row.properties.id).toGeoJson());
                    }
                }
                return features;
            } catch (err) {
                console.error(err);
            }
        } catch (err) {
            console.error(err);
        }
    }

    public async modify(feature) {
        this._pool.connect().then((client) => {
            client.query("UPDATE points SET geo = ST_GeomFromGeoJSON($1), name = $2::text WHERE id = $3;",
                [feature.geo, feature.name, feature.id]).then(() => {
                client.release();
                return feature;
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
