import {Model, Identifiable} from "../game/Model";
import {GeoFeature} from "../geojson/models";

export interface FeatureInteface extends Identifiable {
    _name: string;
    _geo: any;
}

export class Feature extends Model {
    private _name: string;
    private _geo: any;

    constructor(id?: Identifiable)

    // todo: make geo type to a class with JsonSchema
    constructor(data: FeatureInteface) {
        super(data._id);
        this._name = data._name;
        this._geo = data._geo;
    }

    public get name(){
        return this._name;
    }

    public get geo(){
        return this._geo;
    }

    public inPoint(latitude, longtitude, altitude): boolean {
        return undefined;
    }

    public inSquare(top, left, right, bottom): boolean {
        return undefined;
    }
    public toGeoJson(): GeoFeature<Feature> {
        return {
            type: "Feature",
            geometry: this.geo,
            properties: {
                id: this.id,
                name: this.name
            }
        }
    }
}
