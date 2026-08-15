import React, { useEffect, useState } from "react";
import { Sparkles, Feather, BookOpen, Clock } from "lucide-react";
import { motion } from "motion/react";

const NARRATIVE_STEPS = [
  { stage: "Orientasi", text: "Membangun latar suasana dan memperkenalkan tokoh...", icon: "🌅" },
  { stage: "Komplikasi", text: "Merajut konflik, ketegangan, dan dinamika karakter...", icon: "⚡" },
  { stage: "Klimaks", text: "Menuliskan puncak ketegangan cerita yang mendebarkan...", icon: "🔥" },
  { stage: "Resolusi", text: "Menyusun akhir cerita berkesan dan menghitung minimal 500 kata...", icon: "📜" },
];

export const LoadingScreen: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % NARRATIVE_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-8">
        {/* Glowing pulse rings */}
        <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-ping opacity-75" />
        <div className="relative w-24 h-24 rounded-2xl bg-stone-900 border-2 border-amber-500/50 flex items-center justify-center shadow-2xl shadow-amber-950">
          <Feather className="w-12 h-12 text-amber-400 animate-bounce duration-1000" />
        </div>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-100 mb-3"
      >
        Menenun Kisah Fiksi...
      </motion.h3>

      <p className="text-sm sm:text-base text-stone-400 max-w-md mb-8 font-serif-story">
        Google Gemini AI sedang meramu diksi, interaksi tokoh, dan alur narasi utuh minimal 500 kata untukmu.
      </p>

      {/* Progress Steps List */}
      <div className="w-full max-w-md bg-stone-900/90 border border-stone-800 rounded-2xl p-4 shadow-xl text-left space-y-3">
        {NARRATIVE_STEPS.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;

          return (
            <div
              key={step.stage}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-amber-950/40 border border-amber-500/30 text-amber-200"
                  : isDone
                  ? "text-stone-400 opacity-60"
                  : "text-stone-600"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold ${
                  isActive
                    ? "bg-amber-500 text-stone-950 animate-pulse"
                    : isDone
                    ? "bg-stone-800 text-stone-300"
                    : "bg-stone-950 text-stone-600"
                }`}
              >
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {step.stage}
                  </span>
                  {isActive && (
                    <span className="text-[10px] text-amber-400 font-mono animate-pulse">
                      Sedang diproses...
                    </span>
                  )}
                </div>
                <p className="text-xs truncate font-serif-story text-stone-400">
                  {step.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-stone-500">
        <Clock className="w-3.5 h-3.5" />
        <span>Estimasi waktu proses: 5-15 detik</span>
      </div>
    </div>
  );
};
