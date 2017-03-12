import {Identifiable} from "./Model";
import {Specification} from "./Specification";

export interface Repository<T extends Identifiable> {
    add(t: T): void;
    remove(t: T): void;
    update(t: T): void;
    query(spec: Specification<T>): T[];
}
