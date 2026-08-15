import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum dikonfigurasi di server environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Story Generation API Endpoint
app.post("/api/generate-story", async (req, res) => {
  try {
    const { author, theme, characters, customNotes } = req.body;

    if (!author || !theme || !characters || !Array.isArray(characters) || characters.length === 0) {
      return res.status(400).json({
        error: "Parameter tidak lengkap. Nama penulis, tema, dan minimal satu tokoh wajib diisi.",
      });
    }

    const ai = getGeminiClient();

    // Format the list of characters
    const characterListString = characters
      .map((c: { name: string; role: string }, idx: number) => `${idx + 1}. ${c.name} (${c.role || 'Karakter'})`)
      .join(", ");

    // Prompt as specified by user requirements:
    let prompt = `Tuliskan sebuah cerpen fiksi yang menarik berdasarkan tema ${theme}, karya ${author}, dengan melibatkan tokoh-tokoh berikut: ${characterListString}. KETENTUAN KHUSUS: Panjang cerpen WAJIB minimal 500 kata, memiliki struktur narasi lengkap (orientasi, komplikasi, klimaks, resolusi), dan dikemas dengan gaya bahasa yang hidup.`;

    if (customNotes && typeof customNotes === 'string' && customNotes.trim()) {
      prompt += ` Catatan tambahan/latar suasana: ${customNotes.trim()}`;
    }

    const systemInstruction = `Kamu adalah sastrawan dan penulis fiksi profesional berbahasa Indonesia.
Tulis cerpen fiksi berbahasa Indonesia yang mendalam, emosional, estetis, dan kaya diksi.
Pastikan:
1. Dimulai dengan Judul Cerpen yang menarik di baris pertama (misal: "Judul: ...").
2. Memenuhi batas minimal 500 kata (kira-kira 600-1000 kata lebih baik) dengan narasi yang lengkap: Orientasi (pengenalan), Komplikasi (konflik/tantangan), Klimaks (puncak ketegangan), dan Resolusi (penyelesaian yang berkesan).
3. Buat dialog dan deskripsi latar yang hidup serta konsisten dengan sifat tokoh-tokoh yang diberikan.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });

    const generatedText = response.text || "";

    if (!generatedText) {
      return res.status(500).json({ error: "Gagal menghasilkan cerita dari model AI." });
    }

    // Extract title if exists
    let title = `${theme} - ${author}`;
    let storyContent = generatedText;

    const lines = generatedText.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      const firstLine = lines[0];
      if (firstLine.toLowerCase().startsWith("judul:") || firstLine.toLowerCase().startsWith("judul :") || firstLine.startsWith("# ")) {
        title = firstLine.replace(/^(judul\s*:\s*|#\s*)/i, "").replace(/[*_~"']/g, "").trim();
        storyContent = generatedText.replace(firstLine, "").trim();
      }
    }

    // Word count calculation
    const words = storyContent.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    return res.json({
      title: title || `Kisah ${theme}`,
      story: storyContent,
      fullText: generatedText,
      author,
      theme,
      wordCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error generating story:", error);
    return res.status(500).json({
      error: error.message || "Terjadi kesalahan pada server saat memproses cerita.",
    });
  }
});

// Vite Middleware for SPA Development & Production Serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server berjalan pada port ${PORT}`);
  });
}

setupVite();
