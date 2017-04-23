import {Model} from "../game/Model";
import {GeoFeature} from "../geojson/models";

export class Feature extends Model {

    // todo: make geo type to a class with JsonSchema
    constructor(private _name: string, private _geo: any, id?) {
        super(id);
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
