import {FeatureSQLStorage} from "./Storages";
import {FeatureRepository} from "./Repositories";
import * as pg from "pg";

class FeatureFactory {
    private _rep;

    constructor() {
        let config = require("/config/db.json");
        this._rep = new FeatureRepository([new FeatureSQLStorage(new pg.Pool(config.dev))]);
    }

    get repository() {
        return this._rep;
    }
}

export const factory = new FeatureFactory();
