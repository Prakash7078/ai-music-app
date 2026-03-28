export type SupportedLanguage = 'english' | 'hindi' | 'telugu' | 'spanish';

export type LyricLine = {
  id: string;
  timestampMs: number;
  original: string;
  translations: Record<SupportedLanguage, string>;
};

export type LyricsLoadState = 'idle' | 'loading' | 'ready' | 'error';

export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  audioAssetKey: string;
  audioSource: string | number;
  durationMs: number;
  coverColor: string;
  accentColor: string;
  description: string;
  lyrics: LyricLine[];
};

export type SongApiRecord = Omit<Song, 'audioSource'>;
