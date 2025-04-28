import { Request, Response } from 'express';
import User from '../db/models/user';
import bcrypt from 'bcrypt';
import { error } from 'console';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { ApiErrorResponse } from '../utils/ApiErrorResponse';
import { ApiResponse } from '../utils/ApiResponse';

export class UserController {
    constructor() {

    }
    // the admin user will create this user 
    async createUser(req: Request, res: Response) {
        console.log(req.body)
        const { username, email, password, role } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {
            const user = await User.create({ username, email, password: hashedPassword, role });
            
            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).json(new ApiResponse(
                    StatusCodes.BAD_REQUEST,
                    {},
                    'User creation failed'
                ));
            }
            else {

                res.status(StatusCodes.CREATED).json(new ApiResponse(
                    StatusCodes.CREATED,
                    { username: user.username, email: user.email },
                    'User created successfully'
                ));
            }
        }
        catch (err: any) {
            // handle duplicate error (duplicate username or email)   
            if (err.code === 11000) {
                const field = Object.keys(err.keyValue || {})[0] || 'field';
                return res.status(StatusCodes.CONFLICT).json(new ApiErrorResponse(
                    StatusCodes.CONFLICT,
                    `${field.charAt(0).toUpperCase() + field.slice(1)} “${err.keyValue[field]}” is already in use`,
                    [err.message]
                ));
            }
            console.log(error.name)
            // Validation error (e.g. email format)
            if (err.name === 'ValidationError') {
                // Collect all messages into one
                const messages = Object.values(err.errors).map((e: any) => e.message);
                return res.status(StatusCodes.BAD_REQUEST).json(
                    new ApiErrorResponse(
                        StatusCodes.BAD_REQUEST,
                        'Validation error',
                        [messages.join('; ') ]
                    )
                );
            }

            // Fallback
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                new ApiErrorResponse(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'Internal server error',
                    [err.message]
            ));
        }

    }



    async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;
        console.log(username, password);

        try {
            // Find the user by username
            const user = await User.findOne({ username });
            console.log(user);

            // If no user found or password doesn't match, return same error to prevent user enumeration
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(StatusCodes.UNAUTHORIZED).json(
                    new ApiResponse(
                        StatusCodes.UNAUTHORIZED,
                        {},
                        'Invalid username or password'
                    )
                );
            }

            // Generate access token (short-lived)
            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '8h' }  // Token expires in 8 hour
            );

            // Respond with success, user details, and token
            res.status(StatusCodes.OK).json(
                new ApiResponse(
                    StatusCodes.OK,
                    { userId: user._id, username: user.username, email: user.email, authToken: token },
                    'Login successful'
                )
            );

        } catch (error: any) {
            console.error(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                new ApiErrorResponse(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'Internal server error',
                    [error.message]
            ));
        }
    }
}