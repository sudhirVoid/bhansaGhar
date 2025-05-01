import express from 'express';
import MenuController from '../controllers/menu/menuController';
import { addFoodCategorySchema, addFoodItemSchema } from '../schemas/menuSchema';
import { postRequestPayloadValidator } from '../middlewares/requestValidators';
import { adminOnly, userOnly } from '../middlewares/userBasedAuthenticators';

const menuRouter = express.Router();
const menuController = new MenuController();   
menuRouter.post('/addCategory', postRequestPayloadValidator(addFoodCategorySchema), adminOnly, menuController.addCategory);
menuRouter.get('/getCategories', menuController.getCategories);
menuRouter.post('/addFoodItem', postRequestPayloadValidator(addFoodItemSchema), adminOnly, menuController.addFoodItem);
menuRouter.get('/getFoodItems', menuController.getFoodItems);

export default menuRouter;
