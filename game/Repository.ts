import {Identifiable, Model} from "./Model";
import {Specification} from "./Specification";
import {GeoFeatureList, List} from "../geojson/models";

export interface Repository<T extends Model> {
    add(t: T): void;
    remove(t: T): void;
    update(t: T): void;
    query(spec: Specification<T>): Promise<List<T>>;
}
