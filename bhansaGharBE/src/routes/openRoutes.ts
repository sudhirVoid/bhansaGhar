import express from 'express';
import MenuController from '../controllers/menu/menuController';

const openRouter = express.Router();
const menuController = new MenuController();   
// Route to get all food categories
openRouter.get('/getCategories', menuController.getCategories);
openRouter.get('/getFoodItems', menuController.getFoodItems);


export default openRouter;
