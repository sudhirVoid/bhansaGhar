import { Request, Response } from 'express';
import FoodCategory from '../../db/models/foodCategory';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiErrorResponse } from '../../utils/ApiErrorResponse';
import FoodItem from '../../db/models/foodItem';

// Define the request body type
interface CreateFoodItemBody {
    foodName: string;
    categoryId: string;
    userId: string;
    price: number;
    description?: string;
    tags?: string[];
    isAvailable?: boolean;
    variants?: {
        name: string;
        additionalPrice: number;
        available?: boolean;
    }[];
}

interface FoodCategory {
    categoryName: any;
    categoryId: any;
}

class MenuController {
    // POST: Create a new category (admin access assumed handled in middleware)
    public async addCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { categoryName, userId } = req.body;

            const newCategory = new FoodCategory({
                categoryName,
                userId
            });

            await newCategory.save();

            return res.status(StatusCodes.CREATED).json(
                new ApiResponse(
                    StatusCodes.CREATED,
                    newCategory,
                    'Category created successfully'
                )
            );
        } catch (error: any) {
            if (error.code === 11000) {
                return res.status(StatusCodes.CONFLICT).json(
                    new ApiErrorResponse(
                        StatusCodes.CONFLICT,
                        'Category already exists',
                        [error.message]
                    )
                );
            }
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                new ApiErrorResponse(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'Server error',
                    [error.message]
                )
            );
        }
    }

    // GET: Retrieve all categories for current user
    public async getCategories(req: Request, res: Response): Promise<Response> {
        try {
            // TODO : if we make it multitenant then we can make it filter by tenantId
            const categories = await FoodCategory.find().collation({ locale: 'en', strength: 2 });
            const transformedCategories: FoodCategory[] = categories.map((category) => ({
                categoryId: category._id,
                categoryName: category.categoryName
            }));

            return res.status(StatusCodes.OK).json(
                new ApiResponse(
                    StatusCodes.OK,
                    transformedCategories,
                    'Categories fetched successfully'
                )
            );
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                new ApiErrorResponse(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'Server error',
                    [error.message]
                )
            );
        }
    }

    // POST: Create a new food item (admin access assumed handled in middleware)
    public async addFoodItem(
        req: Request<{}, {}, CreateFoodItemBody>,
        res: Response
    ): Promise<Response> {
        try {
            const foodItemData: CreateFoodItemBody = req.body;

            // Optionally set default values
            foodItemData.isAvailable ??= true;
            foodItemData.variants ??= [];

            const newFoodItem = new FoodItem(foodItemData);
            await newFoodItem.save();

            return res.status(StatusCodes.CREATED).json(
                new ApiResponse(
                    StatusCodes.CREATED,
                    newFoodItem,
                    'Food item created successfully'
                )
            );
        } catch (error: any) {
            if (error.code === 11000) {
                return res.status(StatusCodes.CONFLICT).json(
                    new ApiErrorResponse(
                        StatusCodes.CONFLICT,
                        'Food item already exists',
                        [error.message]
                    )
                );
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                new ApiErrorResponse(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'Server error',
                    [error.message]
                )
            );
        }
    }

    // GET: Retrieve all food items for current user
    public async getFoodItems(req: Request, res: Response): Promise<Response> {
        try {
            const foodItems = await FoodItem.find().populate('categoryId', 'categoryName').collation({ locale: 'en', strength: 2 });
            
            return res.status(StatusCodes.OK).json(
                new ApiResponse(
                    StatusCodes.OK,
                    foodItems,
                    'Food items fetched successfully'
                )
            );
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                new ApiErrorResponse(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'Server error',
                    [error.message]
                )
            );
        }
    }
}

export default MenuController;