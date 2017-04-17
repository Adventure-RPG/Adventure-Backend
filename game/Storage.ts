import {Identifiable} from "./Model";
import {Specification} from "./Specification";

export interface Storage<T extends Identifiable> {
    persist(T): void;
    retrieve(spec: Specification<T>): Promise<T[]>;
    modify(T): void;
    delete(T): void;
}