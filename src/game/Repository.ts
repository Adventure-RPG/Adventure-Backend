import {Model} from "./Model";
import {Specification} from "./Specification";

export interface Repository<T extends Model> {
    add(t: T): void;
    remove(t: T): void;
    update(t: T): void;
    query(spec: Specification<T>): Promise<T[]>;
}
