import express from 'express';
import { json } from 'body-parser';
import { errorHandler } from './middlewares/errorHandler';
import { connectMongoDB } from './db/db';
import dotenv from 'dotenv';
import { registerRoutes } from './utils/registerRoutes';

dotenv.config();
const app = express();

// Connect to the database

connectMongoDB();

// Middleware
app.use(json());

// Set up routes
registerRoutes(app);

// global error handler
// This should be the last middleware
// in the middleware stack
app.use(errorHandler);

export default app;