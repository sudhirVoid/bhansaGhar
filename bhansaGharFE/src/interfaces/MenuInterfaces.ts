export interface FoodCategory {
    categoryName: any;
    categoryId: any;
}

export interface FoodItem {
    foodName: string;
    category: FoodCategory;
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