const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
const OPENAI_TRANSLATION_MODEL = process.env.OPENAI_TRANSLATION_MODEL?.trim() || 'gpt-5';
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

const translationCache = new Map();

function buildTranslationCacheKey(lyrics, language) {
  return JSON.stringify({
    language,
    lyrics: lyrics.map((line) => ({
      id: line.id,
      original: line.original,
    })),
  });
}

function fallbackTranslateLyrics(lyrics, language) {
  return lyrics.map((line) => ({
    ...line,
    translations: {
      ...line.translations,
      [language]: line.translations?.[language] ?? line.original,
    },
  }));
}

function extractResponseText(payload) {
  if (typeof payload.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text;
  }

  const texts =
    payload.output
      ?.flatMap((item) => item.content || [])
      ?.filter((item) => item.type === 'output_text' && typeof item.text === 'string')
      ?.map((item) => item.text) || [];

  return texts.join('\n').trim();
}

async function requestTranslationFromOpenAI(lyrics, language) {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_TRANSLATION_MODEL,
      reasoning: {
        effort: 'low',
      },
      input: [
        {
          role: 'developer',
          content:
            'Translate each lyric line into the requested target language. Preserve line meaning, line order, and ids. Return only valid JSON that matches the provided schema.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            language,
            lyrics: lyrics.map((line) => ({
              id: line.id,
              text: line.original,
            })),
          }),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'translated_lyrics',
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              lyrics: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    id: { type: 'string' },
                    translated: { type: 'string' },
                  },
                  required: ['id', 'translated'],
                },
              },
            },
            required: ['lyrics'],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI translation request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const responseText = extractResponseText(payload);

  if (!responseText) {
    throw new Error('OpenAI translation response did not include output text');
  }

  return JSON.parse(responseText);
}

async function translateLyrics(lyrics, language) {
  if (language === 'english') {
    return {
      lyrics: fallbackTranslateLyrics(lyrics, 'english'),
      source: 'original',
    };
  }

  const cacheKey = buildTranslationCacheKey(lyrics, language);
  const cachedTranslation = translationCache.get(cacheKey);

  if (cachedTranslation) {
    return cachedTranslation;
  }

  const existingTranslations = lyrics.every((line) => {
    const translation = line.translations?.[language];
    return Boolean(translation && translation.trim() && translation !== line.original);
  });

  if (existingTranslations) {
    const result = {
      lyrics: fallbackTranslateLyrics(lyrics, language),
      source: 'catalog',
    };

    translationCache.set(cacheKey, result);
    return result;
  }

  if (!OPENAI_API_KEY) {
    const result = {
      lyrics: fallbackTranslateLyrics(lyrics, language),
      source: 'fallback',
    };

    translationCache.set(cacheKey, result);
    return result;
  }

  const payload = await requestTranslationFromOpenAI(lyrics, language);
  const translatedById = new Map(
    (payload.lyrics || []).map((line) => [line.id, line.translated?.trim() || ''])
  );

  const translatedLyrics = lyrics.map((line) => ({
    ...line,
    translations: {
      ...line.translations,
      [language]: translatedById.get(line.id) || line.translations?.[language] || line.original,
    },
  }));

  const result = {
    lyrics: translatedLyrics,
    source: 'openai',
  };

  translationCache.set(cacheKey, result);
  return result;
}

module.exports = {
  translateLyrics,
};
