import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

import { StatusCodes } from 'http-status-codes';
import { ApiErrorResponse } from '../utils/ApiErrorResponse';

export function validateSchema(schema: z.ZodObject<any, any>) {
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