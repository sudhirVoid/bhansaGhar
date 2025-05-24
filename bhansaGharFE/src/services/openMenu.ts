import { ApiResponse } from "@/interfaces/ApiResponse";


export const API_BASE_URL = 'http://localhost:3000/api/v1';

export async function getOpenCategories(): Promise<ApiResponse> {

  const response = await fetch(`${API_BASE_URL}/openMenu/getCategories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch categories');
  }

  return response.json();
}

export async function getOpenFoodItems(): Promise<ApiResponse> {

  const response = await fetch(`${API_BASE_URL}/openMenu/getFoodItems`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch food items');
  }
  return response.json();
}