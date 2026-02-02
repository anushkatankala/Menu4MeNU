package FoodApplication.repo;

import FoodApplication.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipesRepo extends JpaRepository<Food, Long> {
    
    // You can add custom query methods here if needed, for example:
    
    // Find foods by name (case-insensitive)
    List<Food> findByNameContainingIgnoreCase(String name);
    
    // Find foods by main nutrition
    List<Food> findByMainNutrition(String mainNutrition);
    
    // Find foods by tag (you'll need to implement custom logic for this since tags are comma-separated)
    // For now, basic queries will work with JpaRepository's default methods
}