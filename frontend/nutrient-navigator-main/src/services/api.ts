// src/services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface Food {
  id: number;
  name: string;
  mainNutrition: string;
  ingredients: string[];
  recipes: string[];
  recommendations: string[];
  tags: string[];
}

/**
 * Fetch all foods from the backend API
 */
export const getAllFoods = async (): Promise<Food[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/foods`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw error;
  }
};

/**
 * Fetch a single food by ID
 */
export const getFoodById = async (id: number): Promise<Food> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/foods/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching food with id ${id}:`, error);
    throw error;
  }
};

/**
 * Search foods by name
 */
export const searchFoodsByName = async (name: string): Promise<Food[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/foods/search?name=${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching foods:', error);
    throw error;
  }
};

/**
 * Health check endpoint
 */
export const healthCheck = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/foods/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error with health check:', error);
    throw error;
  }
};