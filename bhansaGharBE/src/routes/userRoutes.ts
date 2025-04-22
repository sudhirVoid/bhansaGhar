import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { createUserSchema, userLoginSchema } from '../schemas/userSchema';
import { ZodObject, ZodString, ZodTypeAny } from 'zod';
import { validateSchema } from '../middlewares/payloadValidator';
const router = Router();
const userController = new UserController();

export function userRoutes(app: any) {
    app.use('/api/v1/user', router);
    router.post('/create', validateSchema(createUserSchema), userController.createUser);
    router.post('/login', validateSchema(userLoginSchema), userController.loginUser);
}

