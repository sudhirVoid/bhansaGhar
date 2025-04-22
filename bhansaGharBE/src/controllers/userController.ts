import { Request, Response } from 'express';
import User from '../db/models/user';
import bcrypt from 'bcrypt';
import { error } from 'console';
import jwt from 'jsonwebtoken';

export class UserController {
    constructor() {

    }
    // the admin user will create this user 
    async createUser(req: Request, res: Response) {
        console.log(req.body)
        const { username, email, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {

            const user = await User.create({ username, email, password: hashedPassword });
            if (!user) {
                return res.status(400).json({ error: 'User creation failed' });
            }
            else {

                res.status(201).json({ username, email, password });
            }
        }
        catch (err: any) {
            // handle duplicate error (duplicate username or email)   
            if (err.code === 11000) {
                const field = Object.keys(err.keyValue || {})[0] || 'field';
                return res.status(409).json({
                    error: `${field.charAt(0).toUpperCase() + field.slice(1)} “${err.keyValue[field]}” is already in use`,
                });
            }
            console.log(error.name)
            // Validation error (e.g. email format)
            if (err.name === 'ValidationError') {
                // Collect all messages into one
                const messages = Object.values(err.errors).map((e: any) => e.message);
                return res.status(400).json({ error: messages.join('; ') });
            }

            // Fallback
            return res.status(500).json({ error: 'Internal server error' });
        }

    }



    async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;
        console.log(username, password);

        try {
            // Find the user by username
            const user = await User.findOne({ username });
            console.log(user);

            // If no user found or password doesn't match, return same error to prevent user enumeration
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Credentials did not match' });
            }

            // Generate access token (short-lived)
            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '1h' }  // Token expires in 1 hour
            );

            // Respond with success, user details, and token
            res.status(200).json({
                message: 'Login successful',
                user: { username: user.username, email: user.email },
                token
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}