import React from "react";
import { Sparkles, BookOpen, Feather, Users, Award, Compass, ArrowRight, Maximize2 } from "lucide-react";
import { motion } from "motion/react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 text-center overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-amber-900/15 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium mb-6 shadow-inner"
      >
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>Didukung Teknologi Google Gemini AI</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-100 max-w-4xl leading-tight"
      >
        Generator Cerpen <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">AI</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 text-base sm:text-xl text-stone-300 max-w-2xl font-serif-story leading-relaxed"
      >
        Ubah ide, tema, dan karakter impianmu menjadi cerpen fiksi yang kaya, hidup, dan berbobot dengan struktur narasi utuh minimal 500 kata.
      </motion.p>

      {/* Primary CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4"
      >
        <button
          id="btn-mulai-membuat-cerita"
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold text-lg rounded-xl shadow-lg shadow-amber-900/40 hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Feather className="w-5 h-5 text-stone-950 group-hover:rotate-12 transition-transform duration-300" />
          <span>Mulai Membuat Cerita</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </motion.div>
      <p className="mt-3 text-xs text-stone-400 flex items-center gap-1.5">
        <Maximize2 className="w-3.5 h-3.5 text-amber-400/80" />
        Otomatis mengaktifkan mode layar penuh untuk kenyamanan menulis
      </p>

      {/* Feature Highlights Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full text-left"
      >
        <div className="p-5 rounded-xl bg-stone-800/60 border border-stone-700/60 backdrop-blur-sm hover:border-amber-500/40 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3 border border-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-stone-100 text-base mb-1">Struktur Narasi Utuh</h3>
          <p className="text-xs sm:text-sm text-stone-400 font-serif-story leading-relaxed">
            Menyajikan alur lengkap dari Orientasi, Komplikasi konflik, Klimaks mendebarkan, hingga Resolusi berkesan.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-stone-800/60 border border-stone-700/60 backdrop-blur-sm hover:border-amber-500/40 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3 border border-amber-500/20">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-stone-100 text-base mb-1">Tokoh Dinamis & Bebas</h3>
          <p className="text-xs sm:text-sm text-stone-400 font-serif-story leading-relaxed">
            Tambahkan tokoh tanpa batas dengan nama dan deskripsi sifat khusus agar interaksi cerita terasa nyata.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-stone-800/60 border border-stone-700/60 backdrop-blur-sm hover:border-amber-500/40 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-stone-100 text-base mb-1">Garansi Minimal 500 Kata</h3>
          <p className="text-xs sm:text-sm text-stone-400 font-serif-story leading-relaxed">
            Dilengkapi penghitung kata otomatis memastikan kedalaman cerita fiksi yang memuaskan untuk dibaca.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
