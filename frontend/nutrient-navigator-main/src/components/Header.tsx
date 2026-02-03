// src/components/Header.tsx
import { useState } from "react";
import { Leaf, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  isDark: boolean;
  toggleDarkMode: () => void;
};

const Header = ({ isDark, toggleDarkMode }: HeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const handleProtectedLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!user) {
      e.preventDefault();
      setAuthModalTab('login');
      setShowAuthModal(true);
    } else {
      window.location.href = href;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <>
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
              <a 
                href="/#how-it-works" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                How It Works
              </a>
              <a 
                href="/recipes" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Recipes
              </a>
              <a 
                href="/favorites"
                onClick={(e) => handleProtectedLink(e, '/favorites')}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Favorites {!user && <span className="text-xs">🔒</span>}
              </a>
              <a 
                href="/nutrients" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Nutrients
              </a>
              <a 
                href="/household"
                onClick={(e) => handleProtectedLink(e, '/household')}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                My Household {!user && <span className="text-xs">🔒</span>}
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="px-4 py-2 rounded-full bg-muted text-foreground hover:bg-secondary/80 transform transition-transform duration-200 hover:scale-105 hidden sm:block"
              >
                {isDark ? "☀️" : "🌙"}
              </button>

              {/* Auth Button */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {profile?.username || profile?.first_name || 'User'}
                    </span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setAuthModalTab('login');
                    setShowAuthModal(true);
                  }}
                  className="gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </>
  );
};

export default Header;