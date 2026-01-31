import { Link } from "react-router-dom";
import { Heart, Clock, Users, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  prepTime: string;
  servings: number;
  calories: number;
  nutrients: string[];
  category: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const RecipeCard = ({ recipe, isFavorite, onToggleFavorite }: RecipeCardProps) => {
  return (
    <article
      className="group glass-card overflow-hidden hover:shadow-card transition-all duration-300 animate-fade-up cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm">
          {recipe.category}
        </Badge>
        <Heart
          className="w-6 h-6 absolute top-3 right-3 cursor-pointer transition-colors"
          stroke={isFavorite ? "pink" : "white"}
          fill={isFavorite ? "pink" : "none"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {recipe.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{recipe.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {Array.isArray(recipe.nutrients)
            ? recipe.nutrients.slice(0, 3).map((nutrient) => (
                <span
                  key={nutrient}
                  className="text-xs px-2 py-1 rounded-full bg-mint text-forest font-medium"
                >
                  {nutrient}
                </span>
              ))
            : null}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {recipe.prepTime}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {recipe.servings}
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4" />
            {recipe.calories} cal
          </div>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;