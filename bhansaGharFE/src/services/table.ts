import { ApiResponse } from "@/interfaces/ApiResponse";
import { Table } from "@/interfaces/TableInterfaces";

export const API_BASE_URL = 'http://localhost:3000/api/v1';

export async function addTable(tableData: Table): Promise<ApiResponse> {
    tableData.seatingCapacity = Number(tableData.seatingCapacity);
    const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/table/addTable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(tableData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add table');
  }

  return response.json();
}

export async function getTables(): Promise<ApiResponse> {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Authentication token not found. Please login again.');
  }

  const response = await fetch(`${API_BASE_URL}/table/getTables`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch tables');
  }

  return response.json();
}

export async function updateTableStatus(tableId: string, available: boolean): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/table/updateStatus/${tableId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ available })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update table status');
  }

  return response.json();
}