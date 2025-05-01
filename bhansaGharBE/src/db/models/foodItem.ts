import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodVariant {
  name: string;
  additionalPrice: number;
  available?: boolean;
}

export interface IFoodItem extends Document {
  foodName: string;
  price: number;
  categoryId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  description?: string;
  tags?: string[];
  isAvailable?: boolean;
  variants?: IFoodVariant[];
}

const foodVariantSchema = new Schema<IFoodVariant>({
  name: { type: String, required: true },
  additionalPrice: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true },
});

const foodItemSchema = new Schema<IFoodItem>(
  {
    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodCategory',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
    },
    tags: [String],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    variants: [foodVariantSchema],
  },
  {
    timestamps: true,
  }
);

foodItemSchema.index({ foodName: 1, userId: 1 }, { unique: true });

const FoodItem = mongoose.model<IFoodItem>('FoodItem', foodItemSchema);

export default FoodItem;
