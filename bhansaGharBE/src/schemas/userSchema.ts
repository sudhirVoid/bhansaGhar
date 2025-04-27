import {z} from 'zod';
import { USER_ROLES } from '../enums/userRoles';

export const createUserRequestSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum([USER_ROLES.ADMIN, USER_ROLES.WAITER, USER_ROLES.CHEF], {
      required_error: "Role is required",
      invalid_type_error: "Role must be one of: ADMIN, WAITER, CHEF",
  })
  }).strict();
  
  export const userLoginRequestSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
  });