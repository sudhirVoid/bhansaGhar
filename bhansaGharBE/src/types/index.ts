export interface RequestWithUser extends Express.Request {
    user?: any; // Define the user type as needed
}

export interface ResponseWithData<T> extends Express.Response {
    data?: T;
}

export interface ErrorResponse {
    message: string;
    statusCode: number;
}