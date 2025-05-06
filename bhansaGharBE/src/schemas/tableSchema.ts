import { z } from 'zod';

export const addTableSchema = z.object({
    id: z.string().nullable(),
    tableName: z.string().min(1, { message: "Table name cannot be empty" }),
    seatingCapacity: z.number().positive({ message: "Seating capacity must be a positive number" }),
    available: z.boolean()
});