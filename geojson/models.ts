import {Identifiable} from "../game/Model";
import * as geojson from "geojson";
/**
 * Created by GolemXIV on 23.04.2017.
 */

export interface GeoFeature extends geojson.Feature<geojson.GeometryObject> {
    properties: {
        id?: Identifiable,
        name: string,
    };
}

export function isGeoFeature(obj: any): obj is GeoFeature {
    return "type" in obj;
}

export interface GeoFeatureList extends Array<GeoFeature> { }
