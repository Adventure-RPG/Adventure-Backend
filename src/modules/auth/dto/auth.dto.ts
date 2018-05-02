import {IsAlphanumeric, IsDefined, IsEmail, IsMobilePhone, IsOptional, IsString, Length} from 'class-validator';

export class RegisterDto {
    @IsOptional()
    @IsString()
    @Length(5, 50)
    readonly first_name: string;
    @IsOptional()
    @IsString()
    @Length(5, 50)
    readonly last_name: string;

    @IsDefined()
    @IsEmail()
    @Length(10, 255)
    readonly email: string;

    @IsOptional()
    @IsMobilePhone('ru-RU')
    @Length(8, 20)
    readonly phone: string;

    @IsDefined()
    @IsAlphanumeric()
    @Length(7, 25)
    password: string;
}

export class CredentialsDto {
    @IsDefined()
    @IsEmail()
    @Length(10, 255)
    readonly email: string;

    @IsAlphanumeric()
    @Length(7, 25)
    password: string;
}

export class SendDto {
    @IsDefined()
    @IsEmail()
    @Length(10, 255)
    readonly email: string;
}