import express from 'express';

import { addFoodCategorySchema, addFoodItemSchema } from '../schemas/menuSchema';
import { postRequestPayloadValidator } from '../middlewares/requestValidators';
import { adminOnly, userOnly } from '../middlewares/userBasedAuthenticators';
import TableController from '../controllers/table/tableController';
import { addTableSchema } from '../schemas/tableSchema';

const tableRouter = express.Router();
const tableController = new TableController();   
tableRouter.post('/addTable', postRequestPayloadValidator(addTableSchema), adminOnly, tableController.addTableData);
tableRouter.get('/getTables', tableController.getTableData);
tableRouter.put('/updateTable', adminOnly, tableController.updateTableData);
tableRouter.delete('/deleteTable', tableController.deleteTableData);

export default tableRouter;
