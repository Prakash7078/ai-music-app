import { buildApiUrl } from '@/config/api';
import { LyricLine, SupportedLanguage } from '@/types/music';
import { wait } from '@/utils/async';

type TranslationResponse = {
  lyrics: LyricLine[];
  source?: string;
  message?: string;
};

type TranslationRequest = {
  language: SupportedLanguage;
  lyrics: LyricLine[];
};

export type TranslationResult = {
  lyrics: LyricLine[];
  source: string;
  message?: string;
};

export async function translateLyrics(
  lyrics: LyricLine[],
  language: SupportedLanguage
): Promise<TranslationResult> {
  if (language === 'english') {
    return {
      lyrics: lyrics.map((line) => ({
        ...line,
        translations: {
          ...line.translations,
          english: line.original,
        },
      })),
      source: 'original',
    };
  }

  const endpoint = buildApiUrl('/api/translate-lyrics');

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        lyrics,
      } satisfies TranslationRequest),
    });

    if (!response.ok) {
      throw new Error(`Translation request failed with status ${response.status}`);
    }

    const data = (await response.json()) as TranslationResponse;
    return {
      lyrics: data.lyrics,
      source: data.source || 'fallback',
      message: data.message,
    };
  }

  await wait(250);

  return {
    lyrics: lyrics.map((line) => ({
      ...line,
      translations: {
        ...line.translations,
        [language]: line.translations[language] ?? line.original,
      },
    })),
    source: 'fallback',
  };
}
