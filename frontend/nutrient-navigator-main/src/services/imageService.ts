// src/services/imageService.ts

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE';

/**
 * Fetch an image from Unsplash based on a search query
 * @param query - The search term (e.g., "chicken breast")
 * @param fallbackIndex - Fallback index for placeholder image if API fails
 * @returns Image URL
 */
export const getRecipeImage = async (query: string, fallbackIndex: number = 0): Promise<string> => {
  // Fallback image in case API fails
  const fallbackImage = `https://images.unsplash.com/photo-${1467003909585 + fallbackIndex}?w=400&h=300&fit=crop`;

  // If no access key, return fallback
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
    console.warn('Unsplash API key not configured. Using fallback image.');
    return fallbackImage;
  }

  try {
    // Clean up the query (remove special characters, limit length)
    const cleanQuery = query.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
    
    // Make request to Unsplash API
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanQuery)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Unsplash API request failed');
    }

    const data = await response.json();

    // Check if we got results
    if (data.results && data.results.length > 0) {
      // Return the small image URL (400x300 is good for cards)
      return data.results[0].urls.small || fallbackImage;
    }

    // No results found, return fallback
    return fallbackImage;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return fallbackImage;
  }
};

/**
 * Batch fetch images for multiple recipes
 * @param recipes - Array of recipe objects with name property
 * @returns Map of recipe names to image URLs
 */
export const batchFetchRecipeImages = async (
  recipes: { name: string }[]
): Promise<Map<string, string>> => {
  const imageMap = new Map<string, string>();

  // Fetch images with a delay to avoid rate limiting
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const imageUrl = await getRecipeImage(recipe.name, i);
    imageMap.set(recipe.name, imageUrl);
    
    // Add small delay to avoid rate limiting (50 requests/hour for free tier)
    if (i < recipes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return imageMap;
};

/**
 * Get image URL with caching
 * Uses localStorage to cache image URLs to reduce API calls
 */
export const getCachedRecipeImage = async (
  recipeName: string,
  fallbackIndex: number = 0
): Promise<string> => {
  const cacheKey = `recipe_image_${recipeName}`;
  
  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const imageUrl = await getRecipeImage(recipeName, fallbackIndex);
  
  // Cache the result (expires in 7 days)
  try {
    localStorage.setItem(cacheKey, imageUrl);
  } catch (e) {
    console.warn('Failed to cache image URL:', e);
  }

  return imageUrl;
};