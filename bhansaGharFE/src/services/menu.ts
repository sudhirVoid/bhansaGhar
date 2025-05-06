import { ApiResponse } from "@/interfaces/ApiResponse";
import { FoodItem } from "@/interfaces/MenuInterfaces";

export const API_BASE_URL = 'http://localhost:3000/api/v1';

export async function addCategory(categoryName: string, userId: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/menu/addCategory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ categoryName, userId })
  });

  return await response.json();
}

export async function getCategories(): Promise<ApiResponse> {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication token not found. Please login again.');
  }

  const response = await fetch(`${API_BASE_URL}/menu/getCategories`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch categories');
  }

  return response.json();
}

export async function addFoodItem(payload: FoodItem): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/menu/addFoodItem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add food item');
  }

  return response.json();
}

export async function getFoodItems(): Promise<ApiResponse> {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication token not found. Please login again.');
  }

  const response = await fetch(`${API_BASE_URL}/menu/getFoodItems`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch food items');
  }
  return response.json();
}