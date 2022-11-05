import { StatusCodes } from "http-status-codes";
export interface IErrorResponse {
    statusCode: number;
    status: string;
    message: string;
    serialize(): IError;
}
export interface IError {
    statusCode: number;
    status: string;
    message: string;
}

export abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract status: string;
    constructor(message: string) {
        super(message)
    }
    serialize(): IError {
        return {
            statusCode: this.statusCode,
            status: this.status,
            message: this.message
        }
    }
}

export class BadRequestError extends CustomError {
    statusCode = StatusCodes.BAD_REQUEST;
    status = 'BAD_REQUEST';
    constructor(message: string) {
        super(message)
    }
}

export class UnAuthorizedError extends CustomError {
    statusCode = StatusCodes.UNAUTHORIZED;
    status = 'UNAUTHORIZED';
    constructor(message: string) {
        super(message)
    }
}

export class ServerError extends CustomError {
    statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    status = 'SERVICE_UNAVAILABLE';
    constructor(message: string) {
        super(message)
    }
}

export class NotEnoughBalanceError extends CustomError {
    statusCode = StatusCodes.BAD_REQUEST;
    status = 'BAD_REQUEST';
    constructor(message: string) {
        super(message)
    }
}

export class InvalidInputError extends CustomError {
    statusCode = StatusCodes.BAD_REQUEST;
    status = 'BAD_REQUEST';
    constructor(message: string) {
        super(message)
    }
}