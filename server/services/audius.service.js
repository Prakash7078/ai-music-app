const AUDIO_ASSET_KEYS = ['midnight-city-lights', 'ocean-memory'];
const AUDIUS_API_BASE_URL = 'https://api.audius.co/v1';

function getAudiusHeaders() {
  const token = process.env.AUDIUS_API_BEARER_TOKEN?.trim();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function selectAudioAssetKey(index) {
  return AUDIO_ASSET_KEYS[index % AUDIO_ASSET_KEYS.length];
}

function mapAudiusTrackToSong(track, index) {
  return {
    id: `audius-${track.id}`,
    title: track.title ?? 'Unknown Title',
    artist: track.user?.name ?? 'Unknown Artist',
    album: track.genre || 'Audius Discovery',
    audioAssetKey: selectAudioAssetKey(index),
    streamPath: `/api/tracks/${track.id}/stream`,
    durationMs: Math.round((track.duration || 30) * 1000),
    coverColor: index % 2 === 0 ? '#17312A' : '#11283A',
    accentColor: index % 2 === 0 ? '#1ED760' : '#5FD1FF',
    description:
      track.description?.trim() ||
      `Imported from Audius${track.genre ? ` • ${track.genre}` : ''}`,
    artworkUrl:
      track.artwork?.['480x480'] || track.artwork?.['150x150'] || track.artwork?.['1000x1000'],
    externalUrl: track.permalink ? `https://audius.co${track.permalink}` : undefined,
    sourceProvider: 'Audius',
    lyrics: [],
  };
}

function mapAudiusUser(user) {
  return {
    id: `audius-user-${user.id}`,
    name: user.name ?? 'Unknown Artist',
    handle: user.handle ?? 'unknown',
    bio: user.bio ?? '',
    avatarUrl:
      user.profile_picture?.['480x480'] ||
      user.profile_picture?.['150x150'] ||
      user.profile_picture?.['1000x1000'],
    followerCount: user.follower_count ?? 0,
    trackCount: user.track_count ?? 0,
    isVerified: Boolean(user.is_verified),
    sourceProvider: 'Audius',
    externalUrl: user.permalink ? `https://audius.co${user.permalink}` : undefined,
  };
}

async function fetchFromAudius(pathname, searchParams = {}) {
  const url = new URL(`${AUDIUS_API_BASE_URL}${pathname}`);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...getAudiusHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(`Audius request failed with status ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data?.data) ? data.data : [];
}

async function getTrackStreamUrl(trackId) {
  const url = new URL(`${AUDIUS_API_BASE_URL}/tracks/${trackId}/stream`);
  url.searchParams.set('no_redirect', 'true');

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...getAudiusHeaders(),
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Audius stream request failed with status ${response.status}`);
  }

  const data = await response.json();
  const streamUrl = data?.data ?? data?.url;

  if (!streamUrl) {
    throw new Error('Audius stream URL was not returned');
  }

  return streamUrl;
}

async function getTrendingSongs() {
  const tracks = await fetchFromAudius('/tracks/trending', {
    limit: 12,
    time: 'week',
  });

  return tracks.map(mapAudiusTrackToSong);
}

async function searchSongs(query) {
  const tracks = await fetchFromAudius('/tracks/search', {
    query,
    limit: 12,
  });

  return tracks.map(mapAudiusTrackToSong);
}

async function getFeaturedUsers() {
  const tracks = await fetchFromAudius('/tracks/trending', {
    limit: 12,
    time: 'week',
  });

  const seen = new Set();
  const users = [];

  for (const track of tracks) {
    if (track.user?.id && !seen.has(track.user.id)) {
      seen.add(track.user.id);
      users.push(mapAudiusUser(track.user));
    }
  }

  return users;
}

async function searchUsers(query) {
  const users = await fetchFromAudius('/users/search', {
    query,
    limit: 12,
  });

  return users.map(mapAudiusUser);
}

module.exports = {
  getTrendingSongs,
  searchSongs,
  getFeaturedUsers,
  searchUsers,
  getTrackStreamUrl,
};
