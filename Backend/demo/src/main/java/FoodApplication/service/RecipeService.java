package FoodApplication.service;

import FoodApplication.model.Recipe;
import FoodApplication.repo.RecipeRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    public List<Recipe> getAllRecipes() {
        List<Recipe> recipes = recipeRepository.findAll();
        // Ensure ingredients are initialized for all recipes
        recipes.forEach(recipe -> {
            if (recipe.getIngredients() == null) {
                recipe.setIngredients(new ArrayList<>());
            }
        });
        return recipes;
    }

    public List<Recipe> searchRecipes(String name) {
        return recipeRepository.findByNameContainingIgnoreCase(name);
    }

    public Recipe getRecipeById(Long id) {
        return recipeRepository.findById(id).orElseThrow(() -> new RuntimeException("Recipe not found"));
    }
}
