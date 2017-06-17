/**
 * Created by GolemXIV on 30.04.2017.
 */
import {Value, Properties} from "ts-json-properties";
import * as ajv from "ajv";

export class JsonSchemaFactory {

    @Value("schemes")
    private _schemes: string[];

    @Value("default_scheme")
    private _default_scheme: string;

    private _ajv: ajv.Ajv;

    constructor() {
        let schms: any[] = [];
        for (let key of this._schemes) {
            let obj = Properties.getValue(key);
            schms.push(obj);
        }
        this._ajv = ajv({schemas: schms});
    }

    public validate(data: any, ref: string = this._default_scheme): boolean {
        return this._ajv.validate(ref, data);
    }
}
export const validator = new JsonSchemaFactory();
