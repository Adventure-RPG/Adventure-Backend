import {Model, Identifiable, isIdentifiable} from "../game/Model";
import {GeoFeature, isGeoFeature} from "../geojson/models";


export class Feature extends Model {
    private _name: string;
    private _geo: any;

    constructor(_id?: Identifiable);

    constructor(data: GeoFeature);

    constructor(obj: any) {
        if (isIdentifiable(obj)) {
            super(obj);
        } else if (isGeoFeature(obj)) {
            super(obj.properties.id);
            this._name = obj.properties.name;
            this._geo = obj.geometry;
        }
    }

    public get name(){
        return this._name;
    }

    public get geo(){
        return this._geo;
    }
x
    public inPoint(latitude, longtitude, altitude): boolean {
        return undefined;
    }

    public inSquare(top, left, right, bottom): boolean {
        return undefined;
    }
    public toGeoJson(): GeoFeature {
        return {
            type: "Feature",
            geometry: this.geo,
            properties: {
                id: this.id,
                name: this.name,
            },
        };
    }
}
