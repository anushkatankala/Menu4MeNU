package FoodApplication.repo;

import FoodApplication.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {

    // Find food by name (case-insensitive)
    Optional<Food> findByNameIgnoreCase(String name);

    // Find all foods containing a specific name (partial match)
    List<Food> findByNameContainingIgnoreCase(String name);

    // Find foods by main nutrition type
    List<Food> findByMainNutritionContainingIgnoreCase(String mainNutrition);

    // Custom query to search across multiple fields
    @Query("SELECT f FROM Food f WHERE " +
           "LOWER(f.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.mainNutrition) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.tagsData) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Food> searchFoods(@Param("searchTerm") String searchTerm);

    // Check if food with name already exists
    boolean existsByNameIgnoreCase(String name);
}