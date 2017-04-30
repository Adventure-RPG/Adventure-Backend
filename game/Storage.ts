import {Identifiable} from "./Model";
import {Specification} from "./Specification";
import {GeoFeature, GeoFeatureList} from "../geojson/models";

export interface Storage<T extends Identifiable> {
    persist(T): void;
    retrieve(spec: Specification<T>): Promise<GeoFeatureList>;
    modify(T): void;
    delete(T): void;
}
