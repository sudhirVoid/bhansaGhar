import mongoose, { Schema, Document } from 'mongoose';

// Interface for FoodCategory document
export interface IFoodCategory extends Document {
  categoryName: string;
  userId: mongoose.Types.ObjectId;
}

// Schema definition
const foodCategorySchema = new Schema<IFoodCategory>({
  categoryName: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

//Compound index: categoryName must be case-insensitively unique per user
foodCategorySchema.index(
  { userId: 1, categoryName: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

// Create and export the model
const FoodCategory = mongoose.model<IFoodCategory>('FoodCategory', foodCategorySchema);

export default FoodCategory;
