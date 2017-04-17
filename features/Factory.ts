import {FeatureSQLStorage} from "./Storages";
import {FeatureRepository} from "./Repositories";
import * as pg from "pg";
import {Value, Properties} from "ts-json-properties";

class FeatureFactory {
    private _rep;

    @Value("config.db")
    private dbJson:any;

    constructor() {
        let config = Properties.getValue("db");

        this._rep = new FeatureRepository([new FeatureSQLStorage(new pg.Pool(config.dev))]);
    }

    get repository() {
        return this._rep;
    }
}

export const factory = new FeatureFactory();
