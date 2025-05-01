import mongoose, { Schema, Document } from 'mongoose';
import { USER_ROLES } from '../../enums/userRoles';

interface UserAttributes extends Document {
    username: string;
    email: string;
    password: string;
    role: USER_ROLES.ADMIN | USER_ROLES.WAITER | USER_ROLES.CHEF;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value: string) => {
                    // Simple email validation
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: (props: any) => `${props.value} is not a valid email!`,
            },
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: [USER_ROLES.ADMIN, USER_ROLES.WAITER, USER_ROLES.CHEF],
            required: true,
        },
        refreshToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const User = mongoose.model<UserAttributes>('User', UserSchema);

export default User;
