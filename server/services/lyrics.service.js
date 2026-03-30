const SUPPORTED_LANGUAGES = ['english', 'hindi', 'telugu', 'spanish'];
const LRCLIB_API_BASE_URL = process.env.LRCLIB_API_BASE_URL?.trim() || 'https://lrclib.net/api';
const LRCLIB_USER_AGENT = process.env.LYRICS_USER_AGENT?.trim() || 'ai-music-app/1.0.0';

const lyricsCache = new Map();

function createTranslations(line) {
  return SUPPORTED_LANGUAGES.reduce((translations, language) => {
    translations[language] = line;
    return translations;
  }, {});
}

function normalizeValue(value) {
  return value?.toString().trim().toLowerCase() || '';
}

function buildLyricsCacheKey(song) {
  return JSON.stringify({
    artist: normalizeValue(song.artist),
    title: normalizeValue(song.title),
    album: normalizeValue(song.album),
    durationSeconds: getDurationSeconds(song.durationMs),
  });
}

function getDurationSeconds(durationMs) {
  const duration = Number(durationMs);

  if (!Number.isFinite(duration) || duration <= 0) {
    return undefined;
  }

  return Math.round(duration / 1000);
}

function buildLrclibHeaders() {
  return {
    Accept: 'application/json',
    'User-Agent': LRCLIB_USER_AGENT,
  };
}

async function fetchFromLrclib(pathname, params) {
  const url = new URL(`${LRCLIB_API_BASE_URL}${pathname}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: buildLrclibHeaders(),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`LRCLIB request failed with status ${response.status}`);
  }

  return response.json();
}

function normalizeSongForLookup(song) {
  return {
    title: song.title?.toString().trim() || '',
    artist: song.artist?.toString().trim() || '',
    album: song.album?.toString().trim() || '',
    durationMs: Number(song.durationMs) || 0,
  };
}

function scoreLyricsCandidate(candidate, song) {
  const normalizedSongTitle = normalizeValue(song.title);
  const normalizedSongArtist = normalizeValue(song.artist);
  const normalizedCandidateTitle = normalizeValue(candidate.trackName || candidate.name);
  const normalizedCandidateArtist = normalizeValue(candidate.artistName);
  const durationPenalty = Math.abs((candidate.duration || 0) * 1000 - song.durationMs);

  let score = 0;

  if (normalizedCandidateTitle === normalizedSongTitle) {
    score += 120;
  } else if (normalizedCandidateTitle.includes(normalizedSongTitle)) {
    score += 80;
  }

  if (normalizedCandidateArtist === normalizedSongArtist) {
    score += 120;
  } else if (normalizedCandidateArtist.includes(normalizedSongArtist)) {
    score += 80;
  }

  if (candidate.syncedLyrics) {
    score += 40;
  }

  score -= Math.min(Math.floor(durationPenalty / 1000), 120);

  return score;
}

function parseTimestampToMs(minutesText, secondsText, fractionText) {
  const minutes = Number(minutesText) || 0;
  const seconds = Number(secondsText) || 0;
  const fraction = fractionText ? Number(fractionText.padEnd(3, '0').slice(0, 3)) : 0;

  return minutes * 60_000 + seconds * 1000 + fraction;
}

function parseSyncedLyrics(rawLyrics, songId) {
  const lines = rawLyrics
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const parsedLines = [];

  lines.forEach((line, index) => {
    const match = line.match(/^\[(\d+):(\d{2})(?:[.:](\d{1,3}))?\](.*)$/);

    if (!match) {
      return;
    }

    const text = match[4]?.trim();

    if (!text) {
      return;
    }

    parsedLines.push({
      id: `${songId}-lrclib-${index + 1}`,
      timestampMs: parseTimestampToMs(match[1], match[2], match[3]),
      original: text,
      translations: createTranslations(text),
    });
  });

  return parsedLines;
}

function parsePlainLyrics(rawLyrics, song) {
  const lines = rawLyrics
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const step = Math.max(Math.floor((song.durationMs || 180000) / (lines.length + 1)), 6000);

  return lines.map((line, index) => ({
    id: `${song.songId}-lrclib-plain-${index + 1}`,
    timestampMs: index * step,
    original: line,
    translations: createTranslations(line),
  }));
}

function mapLyricsPayloadToLines(payload, song) {
  if (payload?.syncedLyrics) {
    const synced = parseSyncedLyrics(payload.syncedLyrics, song.songId);

    if (synced.length > 0) {
      return synced;
    }
  }

  if (payload?.plainLyrics) {
    return parsePlainLyrics(payload.plainLyrics, song);
  }

  return [];
}

async function findLyrics(song) {
  const exactMatch = await fetchFromLrclib('/get', {
    track_name: song.title,
    artist_name: song.artist,
    album_name: song.album,
    duration: getDurationSeconds(song.durationMs),
  });

  if (exactMatch) {
    return exactMatch;
  }

  const searchMatches =
    (await fetchFromLrclib('/search', {
      track_name: song.title,
      artist_name: song.artist,
      duration: getDurationSeconds(song.durationMs),
      q: `${song.artist} ${song.title}`,
    })) || [];

  if (!Array.isArray(searchMatches) || searchMatches.length === 0) {
    return null;
  }

  return [...searchMatches].sort((left, right) => scoreLyricsCandidate(right, song) - scoreLyricsCandidate(left, song))[0];
}

async function getTimedLyrics(song) {
  const normalizedSong = normalizeSongForLookup(song);
  const cacheKey = buildLyricsCacheKey(normalizedSong);
  if (lyricsCache.has(cacheKey)) {
    return lyricsCache.get(cacheKey);
  }

  if (!normalizedSong.title || !normalizedSong.artist) {
    return null;
  }

  const lyricsMatch = await findLyrics(normalizedSong);

  if (!lyricsMatch) {
    lyricsCache.set(cacheKey, null);
    return null;
  }

  const lyrics = mapLyricsPayloadToLines(lyricsMatch, {
    songId: song.songId || song.id || `${normalizeValue(song.artist)}-${normalizeValue(song.title)}`,
    durationMs: normalizedSong.durationMs,
  });

  if (lyrics.length === 0) {
    lyricsCache.set(cacheKey, null);
    return null;
  }

  const result = {
    lyrics,
    source: lyricsMatch.syncedLyrics ? 'lrclib_synced' : 'lrclib_plain',
  };

  lyricsCache.set(cacheKey, result);
  return result;
}

module.exports = {
  getTimedLyrics,
};
