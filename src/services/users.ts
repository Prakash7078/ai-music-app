import { buildApiUrl } from '@/config/api';
import { mockSongs } from '@/data/mock-songs';
import { ArtistProfile } from '@/types/music';
import { wait } from '@/utils/async';

type UsersResponse = {
  users: ArtistProfile[];
  source?: string;
  message?: string;
};

function getLocalArtists() {
  const artistsById = new Map<string, ArtistProfile>();

  mockSongs.forEach((song) => {
    const handle = song.artist.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const artistId = `local-artist-${handle || song.id}`;
    const existingArtist = artistsById.get(artistId);

    if (existingArtist) {
      existingArtist.trackCount += 1;
      return;
    }

    artistsById.set(artistId, {
      id: artistId,
      name: song.artist,
      handle: handle || song.artist.toLowerCase().replace(/\s+/g, ''),
      bio: `${song.artist} is part of the local demo catalog.`,
      followerCount: 0,
      trackCount: 1,
      isVerified: false,
      sourceProvider: 'Local demo',
    });
  });

  return Array.from(artistsById.values());
}

export async function fetchFeaturedUsers(): Promise<ArtistProfile[]> {
  const endpoint = buildApiUrl('/api/discover/users');

  if (!endpoint) {
    await wait(150);
    return getLocalArtists();
  }

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Users request failed with status ${response.status}`);
    }

    const data = (await response.json()) as UsersResponse;
    return data.users.length > 0 ? data.users : getLocalArtists();
  } catch {
    await wait(150);
    return getLocalArtists();
  }
}

export async function searchUsers(query: string): Promise<ArtistProfile[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const endpoint = buildApiUrl(`/api/users/search?q=${encodeURIComponent(normalizedQuery)}`);

  if (!endpoint) {
    await wait(150);
    return getLocalArtists().filter((artist) =>
      `${artist.name} ${artist.handle}`.toLowerCase().includes(normalizedQuery.toLowerCase())
    );
  }

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`User search failed with status ${response.status}`);
    }

    const data = (await response.json()) as UsersResponse;
    return data.users;
  } catch {
    await wait(150);
    return getLocalArtists().filter((artist) =>
      `${artist.name} ${artist.handle}`.toLowerCase().includes(normalizedQuery.toLowerCase())
    );
  }
}
