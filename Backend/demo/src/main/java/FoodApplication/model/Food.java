package FoodApplication.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "foods")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    // IMPORTANT: Column is "mainnutrition" (all lowercase, no underscore)
    @Column(name = "mainnutrition")
    private String mainNutrition;

    // These are the RAW database columns (comma-separated strings)
    @JsonIgnore // Don't send these to the frontend
    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredientsRaw;

    @JsonIgnore
    @Column(name = "recipes", columnDefinition = "TEXT")
    private String recipesRaw;

    @JsonIgnore
    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendationsRaw;

    @JsonIgnore
    @Column(name = "tags", columnDefinition = "TEXT")
    private String tagsRaw;

    // These are computed List fields (sent to frontend)
    @Transient
    private List<String> ingredients;

    @Transient
    private List<String> recipes;

    @Transient
    private List<String> recommendations;

    @Transient
    private List<String> tags;

    // ----- Constructors -----

    public Food() {
    }

    public Food(String name, String mainNutrition, List<String> ingredients,
                List<String> recipes, List<String> recommendations, List<String> tags) {
        this.name = name;
        this.mainNutrition = mainNutrition;
        setIngredients(ingredients);
        setRecipes(recipes);
        setRecommendations(recommendations);
        setTags(tags);
    }

    // ----- Helper Methods -----

    private List<String> stringToList(String str) {
        if (str == null || str.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(str.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private String listToString(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "";
        }
        return String.join(", ", list); // Note: adding space after comma for readability
    }


    // ----- Getters & Setters -----

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMainNutrition() {
        return mainNutrition;
    }

    public void setMainNutrition(String mainNutrition) {
        this.mainNutrition = mainNutrition;
    }

    // Ingredients
    public List<String> getIngredients() {
        if (ingredients == null) {
            ingredients = stringToList(ingredientsRaw);
        }
        return ingredients;
    }

    private void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
        this.ingredientsRaw = listToString(ingredients);
    }

    // Recipes
    public List<String> getRecipes() {
        if (recipes == null) {
            recipes = stringToList(recipesRaw);
        }
        return recipes;
    }

    private void setRecipes(List<String> recipes) {
        this.recipes = recipes;
        this.recipesRaw = listToString(recipes);
    }

    // Recommendations
    public List<String> getRecommendations() {
        if (recommendations == null) {
            recommendations = stringToList(recommendationsRaw);
        }
        return recommendations;
    }

    private void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
        this.recommendationsRaw = listToString(recommendations);
    }

    // Tags
    public List<String> getTags() {
        if (tags == null) {
            tags = stringToList(tagsRaw);
        }
        return tags;
    }

    private void setTags(List<String> tags) {
        this.tags = tags;
        this.tagsRaw = listToString(tags);
    }

    @Override
    public String toString() {
        return "Food{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", mainNutrition='" + mainNutrition + '\'' +
                ", ingredients=" + getIngredients() +
                ", recipes=" + getRecipes() +
                ", recommendations=" + getRecommendations() +
                ", tags=" + getTags() +
                '}';
    }
}