import {Model} from "./Model";
import {Specification} from "./Specification";

export interface Storage<T extends Model> {
    persist(T): void;
    retrieve(spec: Specification<T>): Promise<any>;
    modify(T): void;
    delete(T): void;
}
