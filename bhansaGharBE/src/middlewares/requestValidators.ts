import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { ApiErrorResponse } from '../utils/ApiErrorResponse';

export function postRequestPayloadValidator(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Validating request body:', req.body);
      schema.parse(req.body);
      next();
    } catch (error: any) {
      console.error('Validation error:', error);
      if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue: any) => ({
            message: `${issue.path.join('.')} is ${issue.message}`,
        }))
        res.status(StatusCodes.BAD_REQUEST).json(
          new ApiErrorResponse(
            StatusCodes.BAD_REQUEST,
            'Invalid request data',
            errorMessages
          )
        );
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
          new ApiErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Internal server error',
            [error.message]
          )
        );
      }
    }
  };
}

export function privateEndpointValidator() {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json(
      new ApiErrorResponse(
        StatusCodes.UNAUTHORIZED, 
        'Unauthorized access',
        ['Bearer token is required']
      )
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json(
      new ApiErrorResponse(
      StatusCodes.UNAUTHORIZED,
      'Unauthorized access', 
      ['Invalid token format']
      )
      );
    }

    try {
      // Verify JWT token is valid
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      if (!decoded || typeof decoded === 'string') {
        return res.status(StatusCodes.UNAUTHORIZED).json(
          new ApiErrorResponse(
            StatusCodes.UNAUTHORIZED,
            'Unauthorized access',
            ['Invalid token payload']
          )
        );
      }
      req.user = decoded as any; // Attach decoded user info to request object
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json(
      new ApiErrorResponse(
      StatusCodes.UNAUTHORIZED,
      'Unauthorized access',
      ['Invalid token']
      )
      );
    }

    next();
  };
}