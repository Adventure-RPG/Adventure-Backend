import {Model} from '../../database/interfaces/model.interface';

export interface User extends Model {
    readonly username: string;
    readonly password: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly email: string;
    readonly phone: string;
    readonly age: number;
    readonly is_active: boolean;
}