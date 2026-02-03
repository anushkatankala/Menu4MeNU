// src/services/imageService.ts

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE';

/**
 * Fetch an image from Unsplash based on a search query
 * @param query - The search term (e.g., "chicken breast")
 * @param fallbackIndex - Fallback index for placeholder image if API fails
 * @returns Image URL
 */
export const getRecipeImage = async (
  query: string,
  fallbackIndex: number = 0
): Promise<string> => {
  const fallbackImage = `https://images.unsplash.com/photo-${1467003909585 + fallbackIndex}?w=400&h=300&fit=crop`;

  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
    console.warn('Unsplash API key not configured. Using fallback image.');
    return fallbackImage;
  }

  try {
    // Clean up the query
    const cleanQuery = query.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');

    // Break query into keywords (main ingredients / important words)
    const keywords = cleanQuery.split(/\s+/);

    // Fetch multiple images (5 results)
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanQuery)}&per_page=5&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) throw new Error('Unsplash API request failed');

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Try to pick image whose description / alt matches keywords best
      let bestMatch = data.results[0];
      let bestScore = 0;

      for (const result of data.results) {
        const text = `${result.alt_description || ''} ${result.description || ''}`.toLowerCase();
        let score = 0;
        for (const kw of keywords) {
          if (text.includes(kw)) score++;
        }
        if (score > bestScore) {
          bestScore = score;
          bestMatch = result;
        }
      }

      return bestMatch.urls.small || fallbackImage;
    }

    return fallbackImage;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return fallbackImage;
  }
};

/**
 * Batch fetch images for multiple recipes using improved keyword matching
 * @param recipes - Array of recipe objects with name property
 * @returns Map of recipe names to image URLs
 */
export const batchFetchRecipeImages = async (
  recipes: { name: string }[]
): Promise<Map<string, string>> => {
  const imageMap = new Map<string, string>();

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];

    // Check cache first
    const cacheKey = `recipe_image_${recipe.name}`;
    let imageUrl = localStorage.getItem(cacheKey);

    if (!imageUrl) {
      // Fetch using the improved getRecipeImage
      imageUrl = await getRecipeImage(recipe.name, i);

      // Cache result
      try {
        localStorage.setItem(cacheKey, imageUrl);
      } catch (e) {
        console.warn('Failed to cache image URL:', e);
      }
    }

    imageMap.set(recipe.name, imageUrl);

    // Small delay to avoid rate limiting (Unsplash free tier: 50 requests/hour)
    if (i < recipes.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return imageMap;
};

/**
 * Get image URL for a single recipe with caching
 * @param recipeName - Full recipe name
 * @param fallbackIndex - fallback image index
 */
export const getCachedRecipeImage = async (
  recipeName: string,
  fallbackIndex: number = 0
): Promise<string> => {
  const cacheKey = `recipe_image_${recipeName}`;
  
  // Check cache first
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  // Fetch from API
  const imageUrl = await getRecipeImage(recipeName, fallbackIndex);

  // Cache the result
  try {
    localStorage.setItem(cacheKey, imageUrl);
  } catch (e) {
    console.warn('Failed to cache image URL:', e);
  }

  return imageUrl;
};
