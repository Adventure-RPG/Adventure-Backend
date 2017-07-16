import {Identifiable, Model} from "../game/Model";
import * as geojson from "geojson";
import {Feature} from "../features/Model";
/**
 * Created by GolemXIV on 23.04.2017.
 */

export interface GeoFeature extends geojson.Feature<geojson.GeometryObject> {
    properties: {
        id?: number,
        name: string,
    };
}

export function isGeoFeature(obj: any): obj is GeoFeature {
    return "type" in obj;
}

export interface List<T extends Model> {

}

export interface GeoFeatureList extends List<Feature>, geojson.FeatureCollection<geojson.GeometryObject> {
    properties?: {};
}
