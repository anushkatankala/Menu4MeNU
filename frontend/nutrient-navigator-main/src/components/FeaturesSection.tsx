import { Brain, Clock, Heart, Leaf, LineChart, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart Recommendations",
    description: "AI-powered suggestions based on your unique nutritional needs and preferences.",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Focus on whole foods and seasonal ingredients for maximum nutrient absorption.",
  },
  {
    icon: Clock,
    title: "Quick & Easy",
    description: "Filter by prep time to find meals that fit your busy schedule.",
  },
  {
    icon: LineChart,
    title: "Track Progress",
    description: "Monitor your nutrient intake over time with detailed analytics.",
  },
  {
    icon: Users,
    title: "Community Recipes",
    description: "Access thousands of user-submitted recipes with verified nutrition data.",
  },
  {
    icon: Heart,
    title: "Health Goals",
    description: "Set personalized health goals and get meals tailored to achieve them.",
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
