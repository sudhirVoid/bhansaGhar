import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { createUserRequestSchema, userLoginRequestSchema } from '../schemas/userSchema';
import { postRequestPayloadValidator } from '../middlewares/requestValidators';
const userRouter = Router();
const userController = new UserController();

// Register routes
userRouter.post('/create', postRequestPayloadValidator(createUserRequestSchema), userController.createUser);
userRouter.post('/login', postRequestPayloadValidator(userLoginRequestSchema), userController.loginUser);

export { userRouter };