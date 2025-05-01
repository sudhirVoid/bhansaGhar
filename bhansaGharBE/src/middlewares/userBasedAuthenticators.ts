import { Request, Response, NextFunction } from 'express';
import User from '../db/models/user'; 
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiErrorResponse } from '../utils/ApiErrorResponse';
import { USER_ROLES } from '../enums/userRoles';

// Admin-only access check
export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        new ApiErrorResponse(
          StatusCodes.BAD_REQUEST,
          'User ID is required',
          ['userId is missing in request body']
        )
      );
    }

    // Retrieve user from database by userId
    const user = await User.findById(userId);

    // If user doesn't exist or isn't an admin, return 403
    if (!user || user.role !== USER_ROLES.ADMIN) {
      return res.status(StatusCodes.FORBIDDEN).json(
        new ApiErrorResponse(
          StatusCodes.FORBIDDEN,
          'Access Denied',
          ['Only administrators are allowed to access this resource']
        )
      );
    }
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      new ApiErrorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Server error',
        [error.message]
      )
    );
  }
};

// User-only access check
export const userOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        new ApiErrorResponse(
          StatusCodes.BAD_REQUEST,
          'User ID is required',
          ['userId is missing in request body']
        )
      );
    }

    // Retrieve user from database by userId
    const user = await User.findById(userId);

    // If user doesn't exist 
    if (!user) {
      return res.status(StatusCodes.FORBIDDEN).json(
        new ApiErrorResponse(
          StatusCodes.FORBIDDEN,
          'Access Denied',
          ['Only regular users are allowed to access this resource']
        )
      );
    }
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      new ApiErrorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Server error',
        [error.message]
      )
    );
  }
}
