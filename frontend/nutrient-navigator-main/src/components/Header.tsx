import { Leaf } from "lucide-react";

type HeaderProps = {
  isDark: boolean;
  toggleDarkMode: () => void;
};

const Header = ({ isDark, toggleDarkMode }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              Menu4MeNU
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/recipes" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Recipes
            </a>
            <a href="/favorites"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Favorites
            </a>
            <a href="/nutrients" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Nutrients
            </a>
            <a href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              How It Works
            </a>
            <a href="/household" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              My Household
            </a>

          </nav>

          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-full bg-muted text-foreground hover:bg-secondary/80 transform transition-transform duration-200 hover:scale-105"
          >
            {isDark ? "Toggle Light Mode" : "Toggle Dark Mode"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
