import { useState, useCallback, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import NotFound from "./pages/NotFound";
import Favorites from "./pages/Favorites";
import Nutrients from "./pages/Nutrients";
import Household from "./pages/Household";

const queryClient = new QueryClient();

/*Read Page Button*/
const ReadPageButton = () => {
  const [reading, setReading] = useState(false);

  const toggleReading = () => {
    if (reading) {
      window.speechSynthesis.cancel();
      setReading(false);
      return;
    }

    const text =
      document.getElementById("tts-content")?.innerText ||
      document.body.innerText;

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.25;

    utterance.onend = () => setReading(false);

    window.speechSynthesis.speak(utterance);
    setReading(true);
  };

  return (
    <button
      data-tts-ignore
      aria-hidden="true"   
      onClick={toggleReading}
      className={`
        fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full shadow-lg
        transition-transform hover:scale-105
        ${
          reading
            ? "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]"
            : "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
        }
      `}
    >
      {reading ? "Stop Reading" : "Read Page"}
    </button>
  );
};

const AppContent = ({
  isDark,
  toggleDarkMode,
  favorites,
  setFavorites,
}: {
  isDark: boolean;
  toggleDarkMode: () => void;
  favorites: number[];
  setFavorites: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const location = useLocation();

  // Stop reading when route changes
  useEffect(() => {
    window.speechSynthesis.cancel();
  }, [location]);

  return (
    <Routes>
      <Route
        path="/"
        element={<Index isDark={isDark} toggleDarkMode={toggleDarkMode} />}
      />
      <Route
        path="/recipes"
        element={
          <Recipes
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        }
      />
      {/* Recipe Detail Page */}
      <Route
        path="/recipe/:id"
        element={
          <RecipeDetail
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        }
      />
      {/* Protected Routes */}
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites
              isDark={isDark}
              toggleDarkMode={toggleDarkMode}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/household"
        element={
          <ProtectedRoute>
            <Household isDark={isDark} toggleDarkMode={toggleDarkMode} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nutrients"
        element={<Nutrients isDark={isDark} toggleDarkMode={toggleDarkMode} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("isDark");
    if (saved !== null) return JSON.parse(saved);
    return document.documentElement.classList.contains("dark");
  });

  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("isDark", JSON.stringify(isDark));
  }, [isDark]);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ReadPageButton />
            <AppContent
              isDark={isDark}
              toggleDarkMode={toggleDarkMode}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;