const { songs } = require('../data/song.data');

function getAllSongs() {
  return songs;
}

function getAllArtists() {
  const artistsById = new Map();

  songs.forEach((song) => {
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
      bio: `${song.artist} is part of the local demo catalog for the AI Music App.`,
      followerCount: 0,
      trackCount: 1,
      isVerified: false,
      sourceProvider: 'Local demo',
    });
  });

  return Array.from(artistsById.values());
}

function getSongById(songId) {
  return songs.find((song) => song.id === songId) ?? null;
}

function getSongLyrics(songId) {
  const song = getSongById(songId);
  return song ? song.lyrics : null;
}

module.exports = {
  getAllSongs,
  getAllArtists,
  getSongById,
  getSongLyrics,
};
