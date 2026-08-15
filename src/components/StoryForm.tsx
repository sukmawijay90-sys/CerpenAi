import React, { useState } from "react";
import { 
  User, 
  Users,
  Sparkles, 
  Plus, 
  Trash2, 
  BookMarked, 
  Layers, 
  HelpCircle, 
  Wand2, 
  Lightbulb, 
  AlertCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Character, PresetTheme, StoryGenerationRequest } from "../types";

interface StoryFormProps {
  onSubmit: (data: StoryGenerationRequest) => void;
  isLoading: boolean;
  onBackToWelcome: () => void;
}

const PRESET_THEMES: { label: string; value: PresetTheme; desc: string; icon: string }[] = [
  { label: "Fantasi", value: "Fantasi", desc: "Dunia sihir, mitologi & makhluk ajaib", icon: "✨" },
  { label: "Horor", value: "Horor", desc: "Mencekam, misteri gaib & ketakutan psikologis", icon: "👻" },
  { label: "Romantis", value: "Romantis", desc: "Kisah cinta mendalam, emosional & bermakna", icon: "💖" },
  { label: "Sci-Fi", value: "Sci-Fi", desc: "Teknologi masa depan, luar angkasa & distopia", icon: "🚀" },
  { label: "Misteri", value: "Misteri", desc: "Penyelidikan teka-teki & plot twist menegangkan", icon: "🔍" },
  { label: "Petualangan", value: "Petualangan", desc: "Perjalanan epik, eksplorasi & bahaya tak terduga", icon: "🗺️" },
  { label: "Drama Kehidupan", value: "Drama Kehidupan", desc: "Konflik batin, keluarga & realitas kehidupan", icon: "🎭" },
  { label: "Cyberpunk", value: "Cyberpunk", desc: "Dunia neon, AI liar & sindikat perkotaan", icon: "🌆" },
  { label: "Komedi", value: "Komedi", desc: "Humor segar, situasi kocak & ironi ringan", icon: "😄" },
  { label: "Lainnya / Kustom", value: "Lainnya / Kustom", desc: "Tuliskan tema atau premis bebas milikmu sendiri", icon: "✍️" },
];

const INSPIRATION_CHARACTERS = [
  { name: "Kaelen", role: "Prajurit bayaran dengan kutukan api di tangan kirinya" },
  { name: "Maya", role: "Arkeolog muda yang cerdas, keras kepala, dan teliti" },
  { name: "Nenek Ratna", role: "Penjaga kedai teh tua yang mengetahui rahasia kota" },
  { name: "Arga", role: "Detektif sinis yang dihantui kegagalan masa lalu" },
];

export const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isLoading, onBackToWelcome }) => {
  const [author, setAuthor] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<PresetTheme>("Fantasi");
  const [customTheme, setCustomTheme] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [characters, setCharacters] = useState<Character[]>([
    { id: "1", name: "", role: "" },
    { id: "2", name: "", role: "" },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAddCharacter = () => {
    const newId = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setCharacters((prev) => [...prev, { id: newId, name: "", role: "" }]);
  };

  const handleRemoveCharacter = (id: string) => {
    if (characters.length <= 1) {
      setErrors((prev) => ({ ...prev, characters: "Minimal harus ada 1 tokoh dalam cerita." }));
      return;
    }
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.characters;
      return copy;
    });
  };

  const handleCharacterChange = (id: string, field: "name" | "role", value: string) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleAddInspirationCharacter = (item: { name: string; role: string }) => {
    // Check if the last character row is empty, fill it, otherwise append
    const lastChar = characters[characters.length - 1];
    if (lastChar && !lastChar.name.trim() && !lastChar.role.trim()) {
      setCharacters((prev) =>
        prev.map((c, i) => (i === prev.length - 1 ? { ...c, name: item.name, role: item.role } : c))
      );
    } else {
      const newId = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      setCharacters((prev) => [...prev, { id: newId, name: item.name, role: item.role }]);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!author.trim()) {
      newErrors.author = "Nama penulis wajib diisi.";
    }

    const effectiveTheme = selectedTheme === "Lainnya / Kustom" ? customTheme.trim() : selectedTheme;
    if (!effectiveTheme) {
      newErrors.theme = "Tema cerita wajib dipilih atau diisi.";
    }

    const validCharacters = characters.filter((c) => c.name.trim() !== "");
    if (validCharacters.length === 0) {
      newErrors.characters = "Minimal harus mengisi 1 nama tokoh cerita.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const effectiveTheme = selectedTheme === "Lainnya / Kustom" ? customTheme.trim() : selectedTheme;
    const cleanedCharacters = characters
      .filter((c) => c.name.trim() !== "")
      .map((c) => ({
        name: c.name.trim(),
        role: c.role.trim() || "Karakter Fiksi",
      }));

    onSubmit({
      author: author.trim(),
      theme: effectiveTheme,
      characters: cleanedCharacters,
      customNotes: customNotes.trim() || undefined,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-800">
        <div>
          <button
            type="button"
            onClick={onBackToWelcome}
            className="text-xs sm:text-sm text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer mb-1"
          >
            ← Kembali ke Halaman Utama
          </button>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-100 flex items-center gap-2.5">
            <BookMarked className="w-6 h-6 text-amber-500" />
            Formulir Pembuatan Cerpen
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800/80 border border-stone-700 text-xs text-stone-300">
          <Wand2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Gemini 3.7 Flash</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" id="form-cerpen-ai">
        {/* SECTION 1: NAMA PENULIS */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="input-author" className="flex items-center gap-2 text-sm font-semibold text-stone-200">
              <User className="w-4 h-4 text-amber-400" />
              Nama Penulis <span className="text-amber-500">*</span>
            </label>
            <span className="text-xs text-stone-400">Nama atau nama samaran (pen name)</span>
          </div>

          <div className="relative">
            <input
              id="input-author"
              type="text"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                if (errors.author) setErrors((prev) => ({ ...prev, author: "" }));
              }}
              placeholder="Contoh: Sukma Wijaya / Pena Senja / Pramoedya"
              className={`w-full px-4 py-3 bg-stone-950/80 border ${
                errors.author ? "border-rose-500 focus:ring-rose-500" : "border-stone-700 focus:border-amber-500"
              } rounded-xl text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all`}
            />
          </div>
          {errors.author && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.author}
            </p>
          )}
        </div>

        {/* SECTION 2: TEMA CERITA */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="select-theme" className="flex items-center gap-2 text-sm font-semibold text-stone-200">
              <Layers className="w-4 h-4 text-amber-400" />
              Tema Cerita <span className="text-amber-500">*</span>
            </label>
            <span className="text-xs text-stone-400">Pilih tema atau tentukan sendiri</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="select-theme-dropdown" className="text-xs text-stone-400 block mb-1.5">
                Kategori Utama (Dropdown)
              </label>
              <select
                id="select-theme-dropdown"
                value={selectedTheme}
                onChange={(e) => {
                  setSelectedTheme(e.target.value as PresetTheme);
                  if (errors.theme) setErrors((prev) => ({ ...prev, theme: "" }));
                }}
                className="w-full px-4 py-3 bg-stone-950/80 border border-stone-700 rounded-xl text-stone-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
              >
                {PRESET_THEMES.map((theme) => (
                  <option key={theme.value} value={theme.value} className="bg-stone-900 text-stone-100 py-2">
                    {theme.icon} {theme.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="input-custom-theme" className="text-xs text-stone-400 block mb-1.5">
                {selectedTheme === "Lainnya / Kustom" ? "Detail Tema Kustom (Wajib)" : "Penyesuaian / Sub-Tema (Opsional)"}
              </label>
              <input
                id="input-custom-theme"
                type="text"
                value={customTheme}
                onChange={(e) => {
                  setCustomTheme(e.target.value);
                  if (errors.theme) setErrors((prev) => ({ ...prev, theme: "" }));
                }}
                placeholder={
                  selectedTheme === "Lainnya / Kustom"
                    ? "Tulis tema fiksi spesifik impianmu..."
                    : `Contoh: ${selectedTheme} berbalut misteri artefak kuno`
                }
                className={`w-full px-4 py-3 bg-stone-950/80 border ${
                  errors.theme && selectedTheme === "Lainnya / Kustom"
                    ? "border-rose-500 focus:ring-rose-500"
                    : "border-stone-700 focus:border-amber-500"
                } rounded-xl text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all`}
              />
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {PRESET_THEMES.slice(0, 6).map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setSelectedTheme(item.value)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedTheme === item.value
                    ? "bg-amber-500/20 border-amber-500/60 text-amber-300 font-medium"
                    : "bg-stone-800/60 border-stone-700/60 text-stone-400 hover:text-stone-200 hover:border-stone-600"
                }`}
              >
                <span>{item.icon}</span> <span className="ml-1">{item.label}</span>
              </button>
            ))}
          </div>

          {errors.theme && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.theme}
            </p>
          )}
        </div>

        {/* SECTION 3: TOKOH CERITA DINAMIS */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-stone-200">
                <Users className="w-4 h-4 text-amber-400" />
                Tokoh Cerita (Dinamis) <span className="text-amber-500">*</span>
              </label>
              <p className="text-xs text-stone-400 mt-0.5">
                Definisikan nama serta sifat, kepribadian, atau peran masing-masing tokoh.
              </p>
            </div>

            <button
              id="btn-tambah-tokoh"
              type="button"
              onClick={handleAddCharacter}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Tokoh</span>
            </button>
          </div>

          {/* Quick inspiration characters */}
          <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Inspirasi Tokoh Siap Pakai:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {INSPIRATION_CHARACTERS.map((char, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddInspirationCharacter(char)}
                  className="text-xs px-2.5 py-1 bg-stone-800/70 hover:bg-stone-700/80 border border-stone-700 text-stone-300 rounded-lg transition-colors cursor-pointer text-left"
                >
                  + <strong className="text-amber-300 font-medium">{char.name}</strong> ({char.role.substring(0, 24)}...)
                </button>
              ))}
            </div>
          </div>

          {/* Character Dynamic Rows */}
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {characters.map((char, index) => (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-stone-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-amber-400/90 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] flex items-center justify-center font-mono">
                        {index + 1}
                      </span>
                      Tokoh #{index + 1}
                    </span>

                    {characters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCharacter(char.id)}
                        className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-rose-400 hover:bg-rose-950/40 px-2 py-1 rounded transition-colors cursor-pointer"
                        title="Hapus tokoh ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={char.name}
                        onChange={(e) => handleCharacterChange(char.id, "name", e.target.value)}
                        placeholder="Nama Tokoh (misal: Rian / Arumi)"
                        className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700/80 rounded-lg text-sm text-stone-100 placeholder:text-stone-600 focus:border-amber-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="sm:col-span-8">
                      <input
                        type="text"
                        value={char.role}
                        onChange={(e) => handleCharacterChange(char.id, "role", e.target.value)}
                        placeholder="Peran & Sifat (misal: Protagonis yang cerdas, pemberani, tapi keras kepala)"
                        className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700/80 rounded-lg text-sm text-stone-100 placeholder:text-stone-600 focus:border-amber-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {errors.characters && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.characters}
            </p>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleAddCharacter}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Tambah Tokoh Lainnya</span>
            </button>
          </div>
        </div>

        {/* SECTION 4: CATATAN SUASANA / LATAR TAMBAHAN (OPSIONAL) */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="input-custom-notes" className="flex items-center gap-2 text-sm font-semibold text-stone-200">
              <FileText className="w-4 h-4 text-amber-400" />
              Catatan Latar / Suasana Khusus <span className="text-xs text-stone-500 font-normal">(Opsional)</span>
            </label>
          </div>
          <textarea
            id="input-custom-notes"
            rows={2}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Contoh: Suasana malam berkabut di desa lereng gunung tahun 1920, nuansa melankolis..."
            className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700 rounded-xl text-stone-100 text-sm placeholder:text-stone-600 focus:border-amber-500 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            id="btn-generate-cerpen"
            type="submit"
            disabled={isLoading}
            className="w-full group relative flex items-center justify-center gap-3 px-8 py-4.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-lg rounded-2xl shadow-xl shadow-amber-950/50 hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-stone-950 animate-pulse" />
            <span>Generate Cerpen</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-950/20 text-stone-950 border border-stone-950/20">
              Minimal 500 Kata
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
