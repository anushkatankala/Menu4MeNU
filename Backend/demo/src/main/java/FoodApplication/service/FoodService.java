package FoodApplication.service;

import FoodApplication.model.Food;
import FoodApplication.repo.FoodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FoodService {

    private final FoodRepository foodRepository;

    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    /**
     * Get all foods from database
     */
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    /**
     * Get food by ID
     */
    public Optional<Food> getFoodById(Long id) {
        return foodRepository.findById(id);
    }

    /**
     * Get food by name
     */
    public Optional<Food> getFoodByName(String name) {
        return foodRepository.findByNameIgnoreCase(name);
    }

    /**
     * Search foods by term (searches name, nutrition, tags)
     */
    public List<Food> searchFoods(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllFoods();
        }
        return foodRepository.searchFoods(searchTerm.trim());
    }

    /**
     * Find foods by nutrition type
     */
    public List<Food> getFoodsByNutrition(String nutrition) {
        return foodRepository.findByMainNutritionContainingIgnoreCase(nutrition);
    }

    /**
     * Create new food
     */
    public Food createFood(Food food) {
        // Check if food with same name already exists
        if (foodRepository.existsByNameIgnoreCase(food.getName())) {
            throw new IllegalArgumentException("Food with name '" + food.getName() + "' already exists");
        }
        return foodRepository.save(food);
    }

    /**
     * Update existing food
     */
    public Food updateFood(Long id, Food updatedFood) {
        return foodRepository.findById(id)
                .map(existingFood -> {
                    // Update fields
                    existingFood.setName(updatedFood.getName());
                    existingFood.setMainNutrition(updatedFood.getMainNutrition());
                    existingFood.setIngredients(updatedFood.getIngredients());
                    existingFood.setRecipes(updatedFood.getRecipes());
                    existingFood.setRecommendations(updatedFood.getRecommendations());
                    existingFood.setTags(updatedFood.getTags());
                    return foodRepository.save(existingFood);
                })
                .orElseThrow(() -> new IllegalArgumentException("Food with id " + id + " not found"));
    }

    /**
     * Delete food by ID
     */
    public void deleteFood(Long id) {
        if (!foodRepository.existsById(id)) {
            throw new IllegalArgumentException("Food with id " + id + " not found");
        }
        foodRepository.deleteById(id);
    }

    /**
     * Delete all foods
     */
    public void deleteAllFoods() {
        foodRepository.deleteAll();
    }

    /**
     * Get count of foods
     */
    public long getFoodCount() {
        return foodRepository.count();
    }

    /**
     * Check if food exists by ID
     */
    public boolean existsById(Long id) {
        return foodRepository.existsById(id);
    }

    /**
     * Check if food exists by name
     */
    public boolean existsByName(String name) {
        return foodRepository.existsByNameIgnoreCase(name);
    }
}