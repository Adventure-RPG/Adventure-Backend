export class AppException extends Error {
    constructor(msg?: string) {
        super(msg);
    }
}