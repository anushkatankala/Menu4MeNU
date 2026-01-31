package FoodApplication.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "foods")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "main_nutrition")
    private String mainNutrition;

    // Store lists as comma-separated strings in the database
    @Column(length = 2000)
    private String ingredientsData;

    @Column(length = 5000)
    private String recipesData;

    @Column(length = 2000)
    private String recommendationsData;

    @Column(length = 1000)
    private String tagsData;

    // Transient fields (not stored in DB, computed from data fields)
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
        this.ingredients = new ArrayList<>();
        this.recipes = new ArrayList<>();
        this.recommendations = new ArrayList<>();
        this.tags = new ArrayList<>();
    }

    public Food(String name, String mainNutrition, List<String> ingredients,
                List<String> recipes, List<String> recommendations, List<String> tags) {
        this.name = name;
        this.mainNutrition = mainNutrition;
        this.ingredients = ingredients != null ? ingredients : new ArrayList<>();
        this.recipes = recipes != null ? recipes : new ArrayList<>();
        this.recommendations = recommendations != null ? recommendations : new ArrayList<>();
        this.tags = tags != null ? tags : new ArrayList<>();
        
        // Sync data fields
        syncToDataFields();
    }

    // ----- Lifecycle callbacks to sync between list and data fields -----

    @PrePersist
    @PreUpdate
    private void syncToDataFields() {
        this.ingredientsData = listToString(this.ingredients);
        this.recipesData = listToString(this.recipes);
        this.recommendationsData = listToString(this.recommendations);
        this.tagsData = listToString(this.tags);
    }

    @PostLoad
    private void syncFromDataFields() {
        this.ingredients = stringToList(this.ingredientsData);
        this.recipes = stringToList(this.recipesData);
        this.recommendations = stringToList(this.recommendationsData);
        this.tags = stringToList(this.tagsData);
    }

    // ----- Helper methods -----

    private String listToString(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "";
        }
        return String.join(",", list);
    }

    private List<String> stringToList(String data) {
        List<String> list = new ArrayList<>();
        if (data != null && !data.trim().isEmpty()) {
            String[] parts = data.split(",");
            for (String part : parts) {
                String trimmed = part.trim();
                if (!trimmed.isEmpty()) {
                    list.add(trimmed);
                }
            }
        }
        return list;
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

    @JsonProperty("ingredients")
    public List<String> getIngredients() {
        if (this.ingredients == null) {
            syncFromDataFields();
        }
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
        this.ingredientsData = listToString(ingredients);
    }

    @JsonProperty("recipes")
    public List<String> getRecipes() {
        if (this.recipes == null) {
            syncFromDataFields();
        }
        return recipes;
    }

    public void setRecipes(List<String> recipes) {
        this.recipes = recipes;
        this.recipesData = listToString(recipes);
    }

    @JsonProperty("recommendations")
    public List<String> getRecommendations() {
        if (this.recommendations == null) {
            syncFromDataFields();
        }
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
        this.recommendationsData = listToString(recommendations);
    }

    @JsonProperty("tags")
    public List<String> getTags() {
        if (this.tags == null) {
            syncFromDataFields();
        }
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
        this.tagsData = listToString(tags);
    }

    // ----- toString() -----
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