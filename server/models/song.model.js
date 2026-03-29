const { songs } = require('../data/song.data');

const SUPPORTED_LANGUAGES = ['english', 'hindi', 'telugu', 'spanish'];

function createTranslations(line) {
  return SUPPORTED_LANGUAGES.reduce((translations, language) => {
    translations[language] = line;
    return translations;
  }, {});
}

function buildGeneratedLines(title, artist) {
  return [
    `${title} opens softly as the rhythm finds its place.`,
    `${artist} carries the melody forward through the next phrase.`,
    `Each beat from ${title} lands in time with the chorus.`,
    `The groove builds while the room moves with ${artist}.`,
    `This section keeps the energy high and the vocals close.`,
    `${title} fades out with ${artist} still echoing in the mix.`,
  ];
}

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

function generateSongLyrics({ songId, title, artist, durationMs }) {
  const song = songId ? getSongById(songId) : null;
  const resolvedTitle = title || song?.title || 'This track';
  const resolvedArtist = artist || song?.artist || 'The artist';
  const resolvedDurationMs = Math.max(Number(durationMs) || song?.durationMs || 180000, 90000);
  const generatedLines = buildGeneratedLines(resolvedTitle, resolvedArtist);
  const step = Math.max(Math.floor(resolvedDurationMs / (generatedLines.length + 1)), 12000);

  return generatedLines.map((line, index) => ({
    id: `${songId || resolvedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-generated-${index + 1}`,
    timestampMs: index * step,
    original: line,
    translations: createTranslations(line),
  }));
}

module.exports = {
  getAllSongs,
  getAllArtists,
  getSongById,
  getSongLyrics,
  generateSongLyrics,
};
