import { StatusCodes } from "http-status-codes"

class ApiResponse {
    statusCode: StatusCodes
    data: {}
    message: string
    success: boolean
    constructor(
        statusCode: StatusCodes,
        data: {},
        message = "Success"
        ) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }