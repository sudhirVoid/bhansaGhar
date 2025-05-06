import mongoose, { Schema, Document } from 'mongoose';

// Extend the Table interface with Document
export interface TableDocument extends Document {
    tableName: string;
    seatingCapacity: number;
    available: boolean;
    userId: mongoose.Types.ObjectId; // Add userId to interface
}

// Create the schema
const tableSchema = new Schema({
    tableName: {
        type: String,
        required: true,
        unique: true
    },
    seatingCapacity: {
        type: Number,
        required: true,
        min: 1
    },
    available: {
        type: Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Create and export the model
export const ResturantTable = mongoose.model<TableDocument>('Table', tableSchema);