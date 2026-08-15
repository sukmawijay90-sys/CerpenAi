import React, { useState, useEffect } from "react";
import { Feather, Maximize, Minimize, Sparkles } from "lucide-react";
import { AppScreen } from "../types";

interface NavbarProps {
  currentScreen: AppScreen;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onGoHome }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen toggle restricted by browser context:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-stone-950/80 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 shadow-md group-hover:scale-105 transition-transform">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <span className="font-cinzel text-base sm:text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
              Cerpen AI
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              Gemini Studio
            </span>
          </div>
        </button>

        {/* Right Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Keluar Layar Penuh" : "Mode Layar Penuh"}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 text-xs border border-stone-800 transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <Minimize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Layar Normal</span>
              </>
            ) : (
              <>
                <Maximize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Layar Penuh</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
