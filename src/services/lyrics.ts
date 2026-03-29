import { mockSongs } from '@/data/mock-songs';
import { buildApiUrl } from '@/config/api';
import { LyricLine, Song } from '@/types/music';
import { wait } from '@/utils/async';

type TimedLyricsResponse = {
  lyrics: LyricLine[];
};

const GENERATED_LYRIC_STEPS = [0, 0.18, 0.36, 0.54, 0.72, 0.88];

function createTranslations(line: string) {
  return {
    english: line,
    hindi: line,
    telugu: line,
    spanish: line,
  };
}

function buildGeneratedLyrics(song: Pick<Song, 'id' | 'title' | 'artist' | 'durationMs'>): LyricLine[] {
  const generatedLines = [
    `${song.title} opens softly as the rhythm finds its place.`,
    `${song.artist} carries the melody forward through the next phrase.`,
    `Each beat from ${song.title} lands in time with the chorus.`,
    `The groove builds while the room moves with ${song.artist}.`,
    `This section keeps the energy high and the vocals close.`,
    `${song.title} fades out with ${song.artist} still echoing in the mix.`,
  ];
  const resolvedDuration = Math.max(song.durationMs, 90000);

  return generatedLines.map((line, index) => ({
    id: `${song.id}-generated-${index + 1}`,
    timestampMs: Math.floor(resolvedDuration * GENERATED_LYRIC_STEPS[index]),
    original: line,
    translations: createTranslations(line),
  }));
}

export async function fetchTimedLyrics(
  song: Pick<Song, 'id' | 'title' | 'artist' | 'durationMs' | 'lyrics'>
): Promise<LyricLine[]> {
  const endpoint = buildApiUrl(
    `/api/lyrics?songId=${encodeURIComponent(song.id)}&title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}&durationMs=${song.durationMs}`
  );

  if (endpoint) {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Lyrics request failed with status ${response.status}`);
    }

    const data = (await response.json()) as TimedLyricsResponse;
    return data.lyrics.length > 0 ? data.lyrics : buildGeneratedLyrics(song);
  }

  // Mock backend delay so the app already behaves like a real networked client.
  await wait(350);

  const localSong = mockSongs.find((item) => item.id === song.id);

  if (!localSong) {
    return buildGeneratedLyrics(song);
  }

  return localSong.lyrics.map((line) => ({ ...line }));
}
