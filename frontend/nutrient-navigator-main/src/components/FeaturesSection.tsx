import { Brain, Clock, Heart, Leaf, LineChart, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Easy Recipe Discovery",
    description: "Browse recipes with clear details and helpful filters to quickly find what you want to cook.",
  },
  {
    icon: Users,
    title: "Shared Household",
    description: "Share a household space where members can view the current ingredients in their household.",
  },
  {
    icon: Heart,
    title: "Favorites",
    description: "Save your favorite recipes so they’re easy to find and revisit later.",
  },
  {
    icon: Clock,
    title: "Filter by Prep Time",
    description: "Find meals that fit your schedule by filtering recipes based on preparation time.",
  },
  {
    icon: Leaf,
    title: "Ingredient Transparency",
    description: "Every recipe includes a clear ingredient list so you always know what’s involved.",
  },
  {
    icon: LineChart,
    title: "Nutrient Search Bar",
    description: "Quickly find recipes that match your dietary goals by searching for specific nutrients.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 sm:py-32 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you make smarter food choices and reach your health goals.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="group p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-sage/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
