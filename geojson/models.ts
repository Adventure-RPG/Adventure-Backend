import {Identifiable} from "../game/Model";
import {Feature} from "../features/Model";
/**
 * Created by GolemXIV on 23.04.2017.
 */
export interface GeoFeature<T extends Identifiable> {
    type: string;
    geometry: any;

    properties: {
        id?: number,
        name: string,
    };
}

export interface GeoFeatureList<T extends Identifiable> extends Array<GeoFeature<T>> { }
