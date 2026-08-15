import React, { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { StoryForm } from "./components/StoryForm";
import { LoadingScreen } from "./components/LoadingScreen";
import { StoryOutput } from "./components/StoryOutput";
import { Navbar } from "./components/Navbar";
import { AppScreen, StoryGenerationRequest, StoryResult } from "./types";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("welcome");
  const [storyResult, setStoryResult] = useState<StoryResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<StoryGenerationRequest | null>(null);

  // Trigger fullscreen on Start button click as requested
  const handleStart = async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      // In some iframe preview sandboxes, requestFullscreen might be restricted.
      console.warn("Mode fullscreen tidak diizinkan di iframe atau browser:", err);
    }
    setCurrentScreen("form");
    setErrorMessage(null);
  };

  const handleGenerateStory = async (formData: StoryGenerationRequest) => {
    setLastRequest(formData);
    setCurrentScreen("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghasilkan cerpen dari AI.");
      }

      setStoryResult(data);
      setCurrentScreen("output");
    } catch (error: any) {
      console.error("Story generation failed:", error);
      setErrorMessage(error.message || "Terjadi kendala koneksi atau AI saat membuat cerita.");
      setCurrentScreen("form");
    }
  };

  const handleRetry = () => {
    if (lastRequest) {
      handleGenerateStory(lastRequest);
    }
  };

  const handleReset = () => {
    setCurrentScreen("form");
    setStoryResult(null);
    setErrorMessage(null);
  };

  const handleGoHome = () => {
    setCurrentScreen("welcome");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950">
      {/* Top Navigation */}
      <Navbar currentScreen={currentScreen} onGoHome={handleGoHome} />

      {/* Error notification banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-200 flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-rose-100">Gagal Memproses Cerita</p>
                <p className="text-xs text-rose-300 font-serif-story">{errorMessage}</p>
              </div>
            </div>
            {lastRequest && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-rose-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Screen Content */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {currentScreen === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <WelcomeScreen onStart={handleStart} />
            </motion.div>
          )}

          {currentScreen === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <StoryForm
                onSubmit={handleGenerateStory}
                isLoading={false}
                onBackToWelcome={handleGoHome}
              />
            </motion.div>
          )}

          {currentScreen === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <LoadingScreen />
            </motion.div>
          )}

          {currentScreen === "output" && storyResult && (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <StoryOutput storyResult={storyResult} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Subtle Footer */}
      <footer className="py-6 px-4 border-t border-stone-900 text-center text-xs text-stone-600 font-serif-story">
        <p>
          Generator Cerpen AI • Integrasi Google Gemini API • Didesain untuk Penulis & Penggemar Fiksi
        </p>
      </footer>
    </div>
  );
}
