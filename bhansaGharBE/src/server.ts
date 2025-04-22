import express from 'express';
import { json } from 'body-parser';
import { userRoutes } from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { connectDB } from './db/db';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database

connectDB();

// Middleware
app.use(json());

// Set up routes
userRoutes(app);

// global error handler
// This should be the last middleware
// in the middleware stack
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});