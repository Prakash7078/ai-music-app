export type SupportedLanguage = 'english' | 'hindi' | 'telugu' | 'spanish';

export type LyricLine = {
  id: string;
  timestampMs: number;
  original: string;
  translations: Record<SupportedLanguage, string>;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationMs: number;
  coverColor: string;
  accentColor: string;
  description: string;
  lyrics: LyricLine[];
};
