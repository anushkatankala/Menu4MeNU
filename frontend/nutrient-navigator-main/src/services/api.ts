// frontend/nutrient-navigator-main/src/services/api.ts

/**
 * API Service for connecting to Spring Boot backend
 * Base URL: http://localhost:8080/api
 */

const API_BASE_URL = 'http://localhost:8080/api';

export interface Food {
  id?: number;
  name: string;
  mainNutrition: string;
  ingredients: string[];
  recipes: string[];
  recommendations: string[];
  tags: string[];
}

/**
 * Get all foods from database
 */
export const getAllFoods = async (): Promise<Food[]> => {
  const response = await fetch(`${API_BASE_URL}/foods`);
  if (!response.ok) {
    throw new Error('Failed to fetch foods');
  }
  return response.json();
};

/**
 * Get food by ID
 */
export const getFoodById = async (id: number): Promise<Food> => {
  const response = await fetch(`${API_BASE_URL}/foods/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch food');
  }
  return response.json();
};

/**
 * Search foods by query
 */
export const searchFoods = async (query: string): Promise<Food[]> => {
  const response = await fetch(`${API_BASE_URL}/foods/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search foods');
  }
  return response.json();
};

/**
 * Get foods by nutrition type
 */
export const getFoodsByNutrition = async (nutrition: string): Promise<Food[]> => {
  const response = await fetch(`${API_BASE_URL}/foods/nutrition/${encodeURIComponent(nutrition)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch foods by nutrition');
  }
  return response.json();
};

/**
 * Create new food
 */
export const createFood = async (food: Food): Promise<Food> => {
  const response = await fetch(`${API_BASE_URL}/foods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(food),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create food');
  }
  
  return response.json();
};

/**
 * Update existing food
 */
export const updateFood = async (id: number, food: Food): Promise<Food> => {
  const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(food),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update food');
  }
  
  return response.json();
};

/**
 * Delete food by ID
 */
export const deleteFood = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete food');
  }
};

/**
 * Define the response type for the importExcelToDatabase function
 */
export interface ImportExcelResponse {
  success: boolean;
  message: string;
}

/**
 * Import Excel file to database
 */
export const importExcelToDatabase = async (): Promise<ImportExcelResponse> => {
  const response = await fetch(`${API_BASE_URL}/foods/import`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to import Excel');
  }
  
  return response.json();
};

/**
 * Get total food count
 */
export const getFoodCount = async (): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/foods/count`);
  if (!response.ok) {
    throw new Error('Failed to fetch food count');
  }
  const data = await response.json();
  return data.count;
};


export interface Ingredient {
  id?: number;
  name: string;
  quantity: string;
  notes?: string;
}

export interface Recipe {
  id?: number;
  title: string;
  description: string;
  category: string;
  prepTime: number;
  servings: number;
  calories: number;
  imageUrl: string;
  ingredients: Ingredient[];
}

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch(`${API_BASE_URL}/recipes`);
  if (!response.ok) throw new Error("Failed to fetch recipes");
  return response.json();
};

export const getRecipeById = async (id: number): Promise<Recipe> => {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
  if (!response.ok) throw new Error("Failed to fetch recipe");
  return response.json();
};
