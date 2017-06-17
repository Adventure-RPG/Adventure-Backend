import {Identifiable, Model} from "./Model";
import {Specification} from "./Specification";
import {GeoFeature, GeoFeatureList, List} from "../geojson/models";

export interface Storage<T extends Model> {
    persist(T): void;
    retrieve(spec: Specification<T>): Promise<List<T>>;
    modify(T): void;
    delete(T): void;
}
