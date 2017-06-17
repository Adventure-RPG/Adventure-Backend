import {Identifiable} from "./Model";
export interface Specification<T extends Identifiable> {
    specified(T): boolean;
}

export interface SQLSpecification<T extends Identifiable> extends Specification<T> {
    toSqlClause(): string;
}
