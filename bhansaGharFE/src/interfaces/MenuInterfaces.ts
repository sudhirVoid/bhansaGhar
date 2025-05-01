export interface FoodCategory {
    categoryName: any;
    categoryId: any;
}

export interface FoodItemPayload {
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