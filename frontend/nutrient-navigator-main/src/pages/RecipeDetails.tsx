import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipeById } from "@/services/api";

const RecipeDetails = () => {
  const { id } = useParams(); // Get the recipe ID from the route parameter
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching recipe details for ID:", id); // Debug log to check the ID

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(id);
        console.log("Fetched recipe details:", data); // Debug log to check API response
        setRecipe(data);
      } catch (err) {
        console.error("Error fetching recipe details:", err); // Debug log for errors
        setError("Failed to fetch recipe details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div className="text-center text-lg">Loading recipe details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!recipe) {
    console.log("Recipe state is null or undefined"); // Debug log to check recipe state
    return <div className="text-center text-gray-500">No recipe found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-primary">{recipe.name}</h1>
      <p className="text-lg text-muted-foreground mb-6">{recipe.description}</p>

      <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
      <ul className="list-disc pl-6 mb-6">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="text-lg">
            {ingredient.name} - {ingredient.quantity}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mb-3">Nutritional Information</h2>
      <ul className="list-disc pl-6 mb-6">
        {recipe.nutrients && typeof recipe.nutrients === "object" ? (
          Object.entries(recipe.nutrients).map(([key, value]) => (
            <li key={key} className="text-lg">
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
            </li>
          ))
        ) : (
          <li className="text-lg">No nutritional information available.</li>
        )}
      </ul>

      <div className="flex items-center gap-4 text-lg text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Preparation Time:</span> {recipe.prepTime}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Servings:</span> {recipe.servings}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Calories:</span> {recipe.calories} cal
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;