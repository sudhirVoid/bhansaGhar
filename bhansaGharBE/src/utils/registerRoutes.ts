import { privateEndpointValidator } from "../middlewares/requestValidators";
import { userOnly } from "../middlewares/userBasedAuthenticators";
import menuRouter from "../routes/menuRoutes";
import openRoutes from "../routes/openRoutes";
import tableRouter from "../routes/tableRoutes";
import { userRouter } from "../routes/userRoutes";


export function registerRoutes(app: any) {
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/menu', privateEndpointValidator(), userOnly, menuRouter);
    app.use('/api/v1/table', privateEndpointValidator(), userOnly, tableRouter);
    app.use('/api/v1/openMenu', openRoutes)
}

