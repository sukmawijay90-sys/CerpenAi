import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers if needed
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Gunakan metode POST." });
  }

  try {
    let parsedBody = req.body;
    if (typeof parsedBody === "string") {
      try {
        parsedBody = JSON.parse(parsedBody);
      } catch (e) {
        console.warn("Failed to parse string body as JSON:", e);
      }
    }

    const { author, theme, characters, customNotes } = parsedBody || {};

    if (!author || !theme || !characters || !Array.isArray(characters) || characters.length === 0) {
      return res.status(400).json({
        error: "Parameter tidak lengkap. Nama penulis, tema, dan minimal satu tokoh wajib diisi.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY belum dikonfigurasi di Environment Variables Vercel.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Format daftar tokoh
    const characterListString = characters
      .map((c: { name: string; role: string }, idx: number) => `${idx + 1}. ${c.name} (${c.role || "Karakter"})`)
      .join(", ");

    let prompt = `Tuliskan sebuah cerpen fiksi yang menarik berdasarkan tema ${theme}, karya ${author}, dengan melibatkan tokoh-tokoh berikut: ${characterListString}. KETENTUAN KHUSUS: Panjang cerpen WAJIB minimal 500 kata, memiliki struktur narasi lengkap (orientasi, komplikasi, klimaks, resolusi), dan dikemas dengan gaya bahasa yang hidup.`;

    if (customNotes && typeof customNotes === "string" && customNotes.trim()) {
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

    // Ekstraksi judul jika ada
    let title = `${theme} - ${author}`;
    let storyContent = generatedText;

    const lines = generatedText.split("\n").map((l: string) => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      const firstLine = lines[0];
      if (
        firstLine.toLowerCase().startsWith("judul:") ||
        firstLine.toLowerCase().startsWith("judul :") ||
        firstLine.startsWith("# ")
      ) {
        title = firstLine.replace(/^(judul\s*:\s*|#\s*)/i, "").replace(/[*_~"']/g, "").trim();
        storyContent = generatedText.replace(firstLine, "").trim();
      }
    }

    // Hitung kata
    const words = storyContent.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    return res.status(200).json({
      title: title || `Kisah ${theme}`,
      story: storyContent,
      fullText: generatedText,
      author,
      theme,
      wordCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error generating story on Vercel function:", error);
    return res.status(500).json({
      error: error.message || "Terjadi kesalahan pada server saat memproses cerita.",
    });
  }
}
