import React, { useState } from "react";
import { 
  Copy, 
  Check, 
  RotateCcw, 
  Download, 
  BookOpen, 
  User, 
  Layers, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  Share2
} from "lucide-react";
import { motion } from "motion/react";
import { StoryResult } from "../types";

interface StoryOutputProps {
  storyResult: StoryResult;
  onReset: () => void;
}

export const StoryOutput: React.FC<StoryOutputProps> = ({ storyResult, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<"sm" | "base" | "lg" | "xl">("base");

  const wordCount = storyResult.wordCount || storyResult.story.trim().split(/\s+/).filter(Boolean).length;
  const isMinWordMet = wordCount >= 500;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 180));

  const handleCopy = async () => {
    const fullContentToCopy = `${storyResult.title.toUpperCase()}
Karya: ${storyResult.author}
Tema: ${storyResult.theme}
Panjang: ${wordCount} kata

----------------------------------------

${storyResult.story}

----------------------------------------
Dibuat dengan Generator Cerpen AI (Google Gemini)`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullContentToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = fullContentToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Gagal menyalin teks", err);
    }
  };

  const handleDownloadTxt = () => {
    const fullContent = `${storyResult.title.toUpperCase()}
Karya: ${storyResult.author}
Tema: ${storyResult.theme}
Panjang: ${wordCount} kata
Tanggal: ${new Date(storyResult.timestamp).toLocaleString("id-ID")}

========================================

${storyResult.story}

========================================
Dibuat dengan Generator Cerpen AI (Google Gemini)`;

    const blob = new Blob([fullContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeTitle = storyResult.title.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 30);
    link.download = `Cerpen_${safeTitle || "Fiksi"}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const paragraphs = storyResult.story
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case "sm":
        return "text-base leading-relaxed";
      case "lg":
        return "text-xl leading-loose";
      case "xl":
        return "text-2xl leading-loose";
      default:
        return "text-lg leading-relaxed sm:leading-loose";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl mb-8"
      >
        <button
          id="btn-buat-cerita-baru"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-medium rounded-xl border border-stone-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Buat Cerita Baru</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Font Size Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-stone-950 px-2 py-1 rounded-xl border border-stone-800 text-xs text-stone-400">
            <span className="px-1 text-[11px]">Ukuran Teks:</span>
            <button
              type="button"
              onClick={() => setFontSizeLevel("sm")}
              className={`px-2 py-1 rounded ${fontSizeLevel === "sm" ? "bg-amber-500/20 text-amber-300 font-bold" : "hover:text-stone-200"}`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSizeLevel("base")}
              className={`px-2 py-1 rounded ${fontSizeLevel === "base" ? "bg-amber-500/20 text-amber-300 font-bold" : "hover:text-stone-200"}`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSizeLevel("lg")}
              className={`px-2 py-1 rounded ${fontSizeLevel === "lg" ? "bg-amber-500/20 text-amber-300 font-bold" : "hover:text-stone-200"}`}
            >
              A+
            </button>
          </div>

          {/* Download TXT */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-medium rounded-xl border border-stone-700 transition-colors cursor-pointer"
            title="Unduh sebagai file .txt"
          >
            <Download className="w-4 h-4 text-stone-400" />
            <span className="hidden sm:inline">Unduh</span> .TXT
          </button>

          {/* Copy Button */}
          <button
            id="btn-salin-cerita"
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-xl transition-all cursor-pointer shadow-lg ${
              copied
                ? "bg-emerald-600 text-stone-100 shadow-emerald-900/40"
                : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-amber-950/40"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Cerita</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Story Document Canvas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-stone-950/95 border border-stone-800 rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden"
      >
        {/* Subtle decorative background watermark */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Story Metadata Header */}
        <header className="text-center pb-8 mb-8 border-b border-stone-800/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cerpen Fiksi • {storyResult.theme}</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-100 tracking-tight leading-snug">
            {storyResult.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-stone-400 font-serif-story">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-500/80" />
              Karya: <strong className="text-stone-200">{storyResult.author}</strong>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-500/80" />
              Waktu Baca: <strong className="text-stone-200">± {readingTimeMin} Menit</strong>
            </span>
          </div>

          {/* Word Counter Indicator Requirement */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-stone-900 border border-stone-800">
            <div className={`w-2.5 h-2.5 rounded-full ${isMinWordMet ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <span className="text-xs font-medium text-stone-300 font-mono">
              Hitung Kata: <strong className="text-amber-300">{wordCount} kata</strong>
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isMinWordMet ? "Memenuhi syarat (≥500 kata)" : "Target 500 kata"}
            </span>
          </div>
        </header>

        {/* Story Text Body */}
        <article className={`font-serif-story text-stone-200 ${getFontSizeClass()} space-y-6 text-justify`}>
          {paragraphs.map((para, index) => {
            if (index === 0) {
              // First paragraph with elegant drop cap
              const firstChar = para.charAt(0);
              const restPara = para.slice(1);
              return (
                <p key={index} className="indent-4 sm:indent-8">
                  <span className="float-left text-5xl sm:text-6xl font-cinzel font-bold text-amber-400 leading-none mr-3 mt-1 uppercase select-none">
                    {firstChar}
                  </span>
                  {restPara}
                </p>
              );
            }
            return (
              <p key={index} className="indent-4 sm:indent-8">
                {para}
              </p>
            );
          })}
        </article>

        {/* Narrative Stamp Footer */}
        <footer className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500/60" />
            <span>Struktur Narasi: Orientasi, Komplikasi, Klimaks & Resolusi Selesai</span>
          </div>
          <div>
            <span>Tanggal Pembuatan: {new Date(storyResult.timestamp).toLocaleDateString("id-ID", { dateStyle: "long" })}</span>
          </div>
        </footer>
      </motion.div>

      {/* Bottom CTA to restart or duplicate */}
      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 text-sm font-medium rounded-xl border border-stone-800 transition-colors cursor-pointer shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ingin membuat cerpen dengan tokoh atau tema lain? Klik di sini</span>
        </button>
      </div>
    </div>
  );
};
