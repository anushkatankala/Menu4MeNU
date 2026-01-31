package FoodApplication.service;

import FoodApplication.model.Ingredient;
import FoodApplication.repo.IngredientRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public List<Ingredient> getIngredientsForRecipe(Long recipeId) {
        return ingredientRepository.findByRecipeId(recipeId);
    }
}
