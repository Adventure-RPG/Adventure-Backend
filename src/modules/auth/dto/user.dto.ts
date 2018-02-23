import {User} from '../interfaces/user.interface';

export class UserDto {
    readonly first_name: string;
    readonly last_name: string;
    readonly email: string;
    readonly phone: string;
    readonly age: number;
}

export const userDtoFactory = (user: User): UserDto => ({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
    phone: user.phone,
});