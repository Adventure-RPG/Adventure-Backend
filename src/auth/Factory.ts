/**
 * Created by GolemXIV on 12.06.2017.
 */
import {UserSQLStorage} from "./Storages";
import {UserRepository} from "./Repositories";
import * as pg from "pg-rxjs";
import {Value, Properties} from "ts-json-properties";

class UserFactory {
    private _rep;

    constructor() {
        let config = Properties.getValue("settings.db");

        this._rep = new UserRepository([new UserSQLStorage(new pg.Pool(config))]);
    }

    get repository() {
        return this._rep;
    }
}

export const factory = new UserFactory();