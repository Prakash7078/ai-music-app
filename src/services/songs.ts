import { resolveAudioSource } from '@/data/audio-assets';
import { mockSongs } from '@/data/mock-songs';
import { buildApiUrl } from '@/config/api';
import { Song, SongApiRecord } from '@/types/music';
import { wait } from '@/utils/async';

type SongsResponse = {
  songs: SongApiRecord[];
};

function hydrateSong(song: SongApiRecord): Song {
  return {
    ...song,
    audioSource: resolveAudioSource(song.audioAssetKey),
  };
}

export async function fetchSongs(): Promise<Song[]> {
  const endpoint = buildApiUrl('/api/songs');

  if (endpoint) {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Songs request failed with status ${response.status}`);
    }

    const data = (await response.json()) as SongsResponse;
    return data.songs.map(hydrateSong);
  }

  await wait(250);
  return mockSongs;
}
