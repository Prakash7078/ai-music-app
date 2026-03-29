import { resolveAudioSource } from '@/data/audio-assets';
import { mockSongs } from '@/data/mock-songs';
import { buildApiUrl } from '@/config/api';
import { Song, SongApiRecord } from '@/types/music';
import { wait } from '@/utils/async';

type SongsResponse = {
  songs: SongApiRecord[];
  source?: string;
  message?: string;
};

function filterLocalSongs(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return mockSongs.filter((song) =>
    `${song.title} ${song.artist} ${song.album} ${song.description}`
      .toLowerCase()
      .includes(normalizedQuery)
  );
}

function hydrateSong(song: SongApiRecord): Song {
  const remoteAudioSource = song.streamPath ? buildApiUrl(song.streamPath) : null;

  return {
    ...song,
    audioSource: remoteAudioSource ?? resolveAudioSource(song.audioAssetKey),
  };
}

export async function fetchSongs(): Promise<Song[]> {
  const endpoint = buildApiUrl('/api/discover/trending');

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

export async function searchSongs(query: string): Promise<Song[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const endpoint = buildApiUrl(`/api/search?q=${encodeURIComponent(normalizedQuery)}`);

  if (endpoint) {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Song search failed with status ${response.status}`);
    }

    const data = (await response.json()) as SongsResponse;
    return data.songs.map(hydrateSong);
  }

  await wait(200);
  return filterLocalSongs(normalizedQuery);
}
