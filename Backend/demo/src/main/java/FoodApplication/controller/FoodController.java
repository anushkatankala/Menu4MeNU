package FoodApplication.controller;

import FoodApplication.model.Food;
import FoodApplication.service.FoodService;
import FoodApplication.service.RecipesExcelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    private final FoodService foodService;
    private final RecipesExcelService recipesExcelService;

    public FoodController(FoodService foodService, RecipesExcelService recipesExcelService) {
        this.foodService = foodService;
        this.recipesExcelService = recipesExcelService;
    }

    /**
     * GET /api/foods
     * Get all foods from database
     */
    @GetMapping
    public ResponseEntity<List<Food>> getAllFoods() {
        try {
            List<Food> foods = foodService.getAllFoods();
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/foods/{id}
     * Get food by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Food> getFoodById(@PathVariable Long id) {
        return foodService.getFoodById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/foods/search?q=searchTerm
     * Search foods by name, nutrition, or tags
     */
    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFoods(@RequestParam(required = false) String q) {
        try {
            List<Food> foods = foodService.searchFoods(q);
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/foods/nutrition/{type}
     * Get foods by nutrition type
     */
    @GetMapping("/nutrition/{type}")
    public ResponseEntity<List<Food>> getFoodsByNutrition(@PathVariable String type) {
        try {
            List<Food> foods = foodService.getFoodsByNutrition(type);
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/foods
     * Create new food
     */
    @PostMapping
    public ResponseEntity<?> createFood(@RequestBody Food food) {
        try {
            Food createdFood = foodService.createFood(food);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdFood);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create food"));
        }
    }

    /**
     * PUT /api/foods/{id}
     * Update existing food
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFood(@PathVariable Long id, @RequestBody Food food) {
        try {
            Food updatedFood = foodService.updateFood(id, food);
            return ResponseEntity.ok(updatedFood);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update food"));
        }
    }

    /**
     * DELETE /api/foods/{id}
     * Delete food by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFood(@PathVariable Long id) {
        try {
            foodService.deleteFood(id);
            return ResponseEntity.ok(Map.of("message", "Food deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete food"));
        }
    }

    /**
     * POST /api/foods/import
     * Import recipes.xlsx into PostgreSQL
     */
    @PostMapping("/import")
    public ResponseEntity<?> importExcelToPostgres() {
        try {
            long countBefore = foodService.getFoodCount();
            recipesExcelService.importExcelToPostgres();
            long countAfter = foodService.getFoodCount();
            long imported = countAfter - countBefore;
            
            return ResponseEntity.ok(Map.of(
                    "message", "Successfully imported recipes from Excel",
                    "recordsImported", imported,
                    "totalRecords", countAfter
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to import Excel: " + e.getMessage()));
        }
    }

    /**
     * GET /api/foods/count
     * Get total count of foods
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getFoodCount() {
        long count = foodService.getFoodCount();
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * DELETE /api/foods
     * Delete all foods (use with caution!)
     */
    @DeleteMapping
    public ResponseEntity<?> deleteAllFoods() {
        try {
            foodService.deleteAllFoods();
            return ResponseEntity.ok(Map.of("message", "All foods deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete all foods"));
        }
    }
}