import {User} from '../interfaces/user.interface';

export class UserDto {
    readonly first_name: string;
    readonly last_name: string;
    readonly email: string;
    readonly phone: string;
    readonly age: number;

    constructor(user: User) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.phone = user.phone;
        this.age = user.age;
    }
}

export const userDtoFactory = (user: User): UserDto => new UserDto(user);