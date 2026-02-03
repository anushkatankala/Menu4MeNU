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

export interface Household {
  id: number;
  name: string;
}

export interface HouseholdInventoryItem {
  id: number;
  household_id: number;
  name: string;
  quantity: string;
  category: string;
  added_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface HouseholdNeededItem {
  id: number;
  household_id: number;
  name: string;
  added_by: string | null;
  created_at: string;
}

// ============================================
// USER FAVORITES API
// ============================================

export const getUserFavorites = async (userId: string): Promise<number[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/favorites`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user favorites. Status: ${response.status}`);
    }

    const data: number[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching favorites for user ${userId}:`, error);
    return [];
  }
};

export const addFavorite = async (userId: string, recipeId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/favorites/${recipeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to add favorite. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error adding favorite:`, error);
    throw error;
  }
};

export const removeFavorite = async (userId: string, recipeId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/favorites/${recipeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to remove favorite. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error removing favorite:`, error);
    throw error;
  }
};

// ============================================
// HOUSEHOLD API
// ============================================

/**
 * Get user's household
 */
export const getUserHousehold = async (userId: string): Promise<Household> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/household`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch household. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching household for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get household inventory
 */
export const getHouseholdInventory = async (householdId: number): Promise<HouseholdInventoryItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/household/${householdId}/inventory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inventory. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching inventory:`, error);
    throw error;
  }
};

/**
 * Add inventory item
 */
export const addInventoryItem = async (
  householdId: number,
  name: string,
  quantity: string,
  category: string,
  addedBy?: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/household/${householdId}/inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        quantity,
        category,
        added_by: addedBy,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add inventory item. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error adding inventory item:`, error);
    throw error;
  }
};

/**
 * Delete inventory item
 */
export const deleteInventoryItem = async (itemId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/household/inventory/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete inventory item. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting inventory item:`, error);
    throw error;
  }
};

/**
 * Get household needed items
 */
export const getHouseholdNeededItems = async (householdId: number): Promise<HouseholdNeededItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/household/${householdId}/needed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch needed items. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching needed items:`, error);
    throw error;
  }
};

/**
 * Add needed item
 */
export const addNeededItem = async (
  householdId: number,
  name: string,
  addedBy?: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/household/${householdId}/needed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        added_by: addedBy,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add needed item. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error adding needed item:`, error);
    throw error;
  }
};

/**
 * Delete needed item
 */
export const deleteNeededItem = async (itemId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/household/needed/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete needed item. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting needed item:`, error);
    throw error;
  }
};

// ============================================
// FOODS API (existing)
// ============================================

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

export interface PriceResult {
  store: string;
  price: number;
  unit: string;
  distance: string;
  logo: string;
  productUrl?: string;
  savings?: number;
}

export const searchPrices = async (query: string): Promise<PriceResult[]> => {
  // Use the exact path you just confirmed
  const url = `${API_BASE_URL}/api/prices/search?query=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Backend Error: ${response.status}`);

    const data = await response.json();
    
    // Walmart scrapers often return an object with a 'results' array 
    // or just a raw array. We must return an array.
    return Array.isArray(data) ? data : (data.results || []);
  } catch (error) {
    console.error("Scraper failed to fetch:", error);
    throw error; 
  }
};

/**
 * Get mock prices (for testing when real API is slow/unavailable)
 */
export const getMockPrices = async (query: string): Promise<PriceResult[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/prices/mock?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get mock prices. Status: ${response.status}`);
    }

    const results: PriceResult[] = await response.json();
    return results;
  } catch (error) {
    console.error(`Error getting mock prices:`, error);
    throw error;
  }
};