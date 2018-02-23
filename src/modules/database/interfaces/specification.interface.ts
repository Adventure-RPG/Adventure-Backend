import {Model} from './model.interface';

export interface Specification<T extends Model> {
    specified(T): boolean;
    toClause(): any;
}
