import { z } from 'zod';
import mongoose from 'mongoose';

export const addFoodCategorySchema = z.object({
  categoryName: z.string().trim().min(1, { message: 'Category name is required' }),
  userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid userId'
  })
});

export const getFoodCategorySchema = z.object({
  userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid userId'
  })
});


export const addFoodItemSchema = z.object({
  foodName: z.string().min(1, 'Food name is required'),
  price: z.number().positive('Price must be a positive number'),
  category: z.object({
    categoryId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid category ID',
    }),
    categoryName: z.string().min(1, 'Category name is required')
  }),
  userId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid user ID',
  }),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional().default(true),

  variants: z.array(z.object({
    name: z.string(),
    additionalPrice: z.number().nonnegative(),
    available: z.boolean().default(true),
  })).optional()
});

