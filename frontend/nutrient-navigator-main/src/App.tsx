import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const readPage = () => {
    const synth = window.speechSynthesis;

    if (synth.speaking) {
      synth.cancel(); // stop if already reading
      return;
    }


    // Only read the main content
    const text =
      document.getElementById("tts-content")?.innerText || "";
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Global Read Page button */}
          <button
            onClick={readPage}
            className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full bg-primary text-white shadow-lg
                      transform transition-transform duration-200 hover:scale-105"
            aria-label="Read page aloud"
          >
            🔊 Read page
          </button>


          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
