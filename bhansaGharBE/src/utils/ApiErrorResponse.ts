import { StatusCodes } from "http-status-codes";

class ApiErrorResponse extends Error {
    statusCode: StatusCodes;
    data: null;
    success: boolean;
    errors: any[];
    constructor(
        statusCode: StatusCodes,
        message= "Something went wrong",
        errors: any = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export { ApiErrorResponse }