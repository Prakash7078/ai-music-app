import { buildApiUrl } from '@/config/api';
import { LyricLine, SupportedLanguage } from '@/types/music';
import { wait } from '@/utils/async';

type TranslationResponse = {
  lyrics: LyricLine[];
};

type TranslationRequest = {
  language: SupportedLanguage;
  lyrics: LyricLine[];
};

export async function translateLyrics(
  lyrics: LyricLine[],
  language: SupportedLanguage
): Promise<LyricLine[]> {
  if (language === 'english') {
    return lyrics.map((line) => ({
      ...line,
      translations: {
        ...line.translations,
        english: line.original,
      },
    }));
  }

  const endpoint = buildApiUrl('/translate-lyrics');

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
    return data.lyrics;
  }

  await wait(250);

  return lyrics.map((line) => ({
    ...line,
    translations: {
      ...line.translations,
      [language]: line.translations[language] ?? line.original,
    },
  }));
}
