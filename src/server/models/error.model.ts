export class Error {
    Status: number;
    Message: string;

    constructor(
        status: number,
        message: string
    ) {
        this.Status = status;
        this.Message = message;
    }
}
