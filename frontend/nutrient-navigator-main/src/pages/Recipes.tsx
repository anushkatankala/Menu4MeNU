import { useState } from "react";
import { Search, Clock, Users, Flame, Filter, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const recipes: Recipe[] = [
  {
    id: 1,
    title: "Grilled Salmon with Quinoa",
    description: "Omega-3 rich salmon paired with protein-packed quinoa and seasonal vegetables.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    prepTime: "25 min",
    servings: 2,
    calories: 450,
    nutrients: ["Protein", "Omega-3", "Iron"],
    category: "Dinner",
  },
  {
    id: 2,
    title: "Spinach & Berry Smoothie Bowl",
    description: "Antioxidant-packed breakfast bowl with fresh berries and iron-rich spinach.",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
    prepTime: "10 min",
    servings: 1,
    calories: 320,
    nutrients: ["Vitamin C", "Iron", "Fiber"],
    category: "Breakfast",
  },
  {
    id: 3,
    title: "Mediterranean Chickpea Salad",
    description: "Fiber-rich chickpeas with fresh vegetables and olive oil dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    prepTime: "15 min",
    servings: 4,
    calories: 280,
    nutrients: ["Fiber", "Protein", "Vitamin A"],
    category: "Lunch",
  },
  {
    id: 4,
    title: "Avocado Toast with Eggs",
    description: "Creamy avocado on whole grain toast topped with perfectly poached eggs.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
    prepTime: "12 min",
    servings: 1,
    calories: 380,
    nutrients: ["Healthy Fats", "Protein", "Vitamin E"],
    category: "Breakfast",
  },
  {
    id: 5,
    title: "Thai Coconut Curry",
    description: "Aromatic curry with vegetables and tofu in creamy coconut milk.",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    prepTime: "35 min",
    servings: 4,
    calories: 420,
    nutrients: ["Vitamin B6", "Potassium", "Fiber"],
    category: "Dinner",
  },
  {
    id: 6,
    title: "Greek Yogurt Parfait",
    description: "Protein-rich Greek yogurt layered with granola and fresh fruits.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
    prepTime: "5 min",
    servings: 1,
    calories: 290,
    nutrients: ["Calcium", "Protein", "Probiotics"],
    category: "Snack",
  },
  {
    id: 7,
    title: "Lemon Herb Grilled Chicken",
    description: "Tender chicken breast marinated in fresh herbs and citrus.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop",
    prepTime: "30 min",
    servings: 4,
    calories: 350,
    nutrients: ["Protein", "Vitamin B12", "Zinc"],
    category: "Dinner",
  },
  {
    id: 8,
    title: "Kale Caesar Salad",
    description: "Nutrient-dense kale with homemade Caesar dressing and parmesan.",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    prepTime: "15 min",
    servings: 2,
    calories: 260,
    nutrients: ["Vitamin K", "Vitamin A", "Calcium"],
    category: "Lunch",
  },
  {
    id: 9,
    title: "Banana Oat Pancakes",
    description: "Fluffy whole grain pancakes naturally sweetened with ripe bananas.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    prepTime: "20 min",
    servings: 2,
    calories: 340,
    nutrients: ["Fiber", "Potassium", "Magnesium"],
    category: "Breakfast",
  },
  {
    id: 10,
    title: "Roasted Vegetable Buddha Bowl",
    description: "Colorful roasted vegetables over brown rice with tahini drizzle.",
    image: "https://images.unsplash.com/photo-1540914124281-342587941389?w=400&h=300&fit=crop",
    prepTime: "40 min",
    servings: 2,
    calories: 480,
    nutrients: ["Fiber", "Iron", "Vitamin C"],
    category: "Lunch",
  },
  {
    id: 11,
    title: "Almond Butter Energy Bites",
    description: "No-bake protein balls perfect for post-workout snacking.",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop",
    prepTime: "15 min",
    servings: 12,
    calories: 120,
    nutrients: ["Protein", "Healthy Fats", "Magnesium"],
    category: "Snack",
  },
  {
    id: 12,
    title: "Shrimp Stir-Fry",
    description: "Quick and nutritious stir-fry with shrimp and crisp vegetables.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    prepTime: "20 min",
    servings: 3,
    calories: 320,
    nutrients: ["Protein", "Selenium", "Vitamin D"],
    category: "Dinner",
  },
];

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.nutrients.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background">
      <div id="tts-content">
        <Header />
        {/* Hero Section */}
        <section className="pt-28 pb-12 sm:pt-32 sm:pb-16 gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-up">
                Our Recipe Collection
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
                Discover nutritious and delicious meals tailored to your dietary needs
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mt-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search recipes or nutrients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-card border-border rounded-full text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-6 rounded-full gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>
              </div>

              {/* Category Filters */}
              {showFilters && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center animate-fade-in">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "bg-card border border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recipes Grid */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredRecipes.length}</span> recipes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe, index) => (
                <article
                  key={recipe.id}
                  className="group glass-card overflow-hidden hover:shadow-card transition-all duration-300 animate-fade-up cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
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
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{recipe.description}</p>

                    {/* Nutrients */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {recipe.nutrients.slice(0, 3).map((nutrient) => (
                        <span
                          key={nutrient}
                          className="text-xs px-2 py-1 rounded-full bg-mint text-forest font-medium"
                        >
                          {nutrient}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
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
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No recipes found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default Recipes;
