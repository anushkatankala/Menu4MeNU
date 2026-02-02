package FoodApplication.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import FoodApplication.model.Food;
import FoodApplication.repo.RecipesRepo;
import FoodApplication.service.RecipesExcelService;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "http://localhost:5173") // Adjust this to your frontend URL
public class FoodController {

    private final RecipesRepo recipesRepo;
    private final RecipesExcelService recipesExcelService;

    public FoodController(RecipesRepo recipesRepo, RecipesExcelService recipesExcelService) {
        this.recipesRepo = recipesRepo;
        this.recipesExcelService = recipesExcelService;
    }

    /**
     * GET /api/foods
     * Fetches all foods from the PostgreSQL database
     */
    @GetMapping
    @SuppressWarnings("CallToPrintStackTrace")
    public ResponseEntity<List<Food>> getAllFoods() {
        try {
            List<Food> foods = recipesRepo.findAll();
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/foods/{id}
     * Fetches a single food by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Food> getFoodById(@PathVariable Long id) {
        return recipesRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/foods/search?name=...
     * Search foods by name (case-insensitive)
     */
    @GetMapping("/search")
    @SuppressWarnings("CallToPrintStackTrace")
    public ResponseEntity<List<Food>> searchFoodsByName(@RequestParam String name) {
        try {
            List<Food> foods = recipesRepo.findByNameContainingIgnoreCase(name);
            return ResponseEntity.ok(foods);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/foods/import
     * Imports recipes.xlsx into PostgreSQL (for initial setup)
     * This is kept from your original code in case you need it
     */
    @GetMapping("/import")
    @SuppressWarnings("CallToPrintStackTrace")
    public ResponseEntity<String> importExcelToPostgres() {
        try {
            recipesExcelService.importExcelToPostgres();
            return ResponseEntity.ok("Successfully imported recipes.xlsx into PostgreSQL");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Failed to import: " + e.getMessage());
        }
    }

    /**
     * GET /api/foods/health
     * Simple health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Food API is running!");
    }
}