import { mockSongs } from '@/data/mock-songs';
import { buildApiUrl } from '@/config/api';
import { LyricLine } from '@/types/music';
import { wait } from '@/utils/async';

type TimedLyricsResponse = {
  lyrics: LyricLine[];
};

export async function fetchTimedLyrics(songId: string): Promise<LyricLine[]> {
  const endpoint = buildApiUrl(`/api/lyrics?songId=${encodeURIComponent(songId)}`);

  if (endpoint) {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Lyrics request failed with status ${response.status}`);
    }

    const data = (await response.json()) as TimedLyricsResponse;
    return data.lyrics;
  }

  // Mock backend delay so the app already behaves like a real networked client.
  await wait(350);

  const song = mockSongs.find((item) => item.id === songId);

  if (!song) {
    throw new Error('Song lyrics not found');
  }

  return song.lyrics.map((line) => ({ ...line }));
}
