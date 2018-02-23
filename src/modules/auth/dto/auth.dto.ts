export class RegisterDto {
    readonly first_name: string;
    readonly last_name: string;
    readonly email: string;
    readonly password: string;
}

export class CredentialsDto {
    readonly email: string;
    readonly password: string;
}