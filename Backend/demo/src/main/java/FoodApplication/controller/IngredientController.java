package FoodApplication.controller;

import FoodApplication.model.Ingredient;
import FoodApplication.service.IngredientService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {

    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping("/recipe/{recipeId}")
    public List<Ingredient> getIngredients(@PathVariable Long recipeId) {
        return ingredientService.getIngredientsForRecipe(recipeId);
    }
}
