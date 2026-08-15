export interface Character {
  id: string;
  name: string;
  role: string;
}

export type PresetTheme =
  | "Fantasi"
  | "Horor"
  | "Romantis"
  | "Sci-Fi"
  | "Misteri"
  | "Petualangan"
  | "Drama Kehidupan"
  | "Cyberpunk"
  | "Komedi"
  | "Lainnya / Kustom";

export interface StoryGenerationRequest {
  author: string;
  theme: string;
  characters: { name: string; role: string }[];
  customNotes?: string;
}

export interface StoryResult {
  title: string;
  story: string;
  fullText: string;
  author: string;
  theme: string;
  wordCount: number;
  timestamp: string;
}

export type AppScreen = "welcome" | "form" | "loading" | "output";
