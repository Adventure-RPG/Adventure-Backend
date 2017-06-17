import {FeatureSQLStorage} from "./Storages";
import {FeatureRepository} from "./Repositories";
import * as pg from "pg";
import {Value, Properties} from "ts-json-properties";

class FeatureFactory {
    private _rep;

    @Value("settings.db")
    private dbJson:any;

    constructor() {
        console.log(this.dbJson);
        let config = Properties.getValue("settings.db");

        this._rep = new FeatureRepository([new FeatureSQLStorage(new pg.Pool(config))]);
    }

    get repository() {
        return this._rep;
    }
}

export const factory = new FeatureFactory();
