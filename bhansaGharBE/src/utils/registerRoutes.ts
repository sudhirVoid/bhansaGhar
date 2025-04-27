import { userRouter } from "../routes/userRoutes";


export function registerRoutes(app: any) {
    app.use('/api/v1/user', userRouter);
}

