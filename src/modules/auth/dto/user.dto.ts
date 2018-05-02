import {User} from '../interfaces/user.interface';

export class UserDto {
    readonly _id?: any;
    readonly first_name: string;
    readonly last_name: string;
    readonly email: string;
    readonly phone: string;
    readonly age: number;
    readonly is_active: boolean;

    constructor(user: User) {
        this._id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.phone = user.phone;
        this.age = user.age;
        this.is_active = user.is_active;
    }

    toJSON() {
        return {
          email: this.email,
          is_active: this.is_active,
        };
    }
}

export const userDtoFactory = (user: User): UserDto => new UserDto(user);