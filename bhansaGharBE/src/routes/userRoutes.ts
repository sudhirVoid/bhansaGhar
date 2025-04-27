import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { createUserRequestSchema, userLoginRequestSchema } from '../schemas/userSchema';
import { validateSchema } from '../middlewares/payloadValidator';
const userRouter = Router();
const userController = new UserController();

// Register routes
userRouter.post('/create', validateSchema(createUserRequestSchema), userController.createUser);
userRouter.post('/login', validateSchema(userLoginRequestSchema), userController.loginUser);

export { userRouter };