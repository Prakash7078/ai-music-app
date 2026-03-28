const songModel = require('../models/song.model');

function getSongs(_req, res) {
  return res.status(200).json({ songs: songModel.getAllSongs() });
}

function getLyrics(req, res) {
  const { songId } = req.query;

  if (!songId) {
    return res.status(400).json({ message: 'songId query parameter is required' });
  }

  const lyrics = songModel.getSongLyrics(songId);

  if (!lyrics) {
    return res.status(404).json({ message: 'Lyrics not found for this song' });
  }

  return res.status(200).json({ lyrics });
}

function translateLyrics(req, res) {
  const { lyrics, language } = req.body;

  if (!Array.isArray(lyrics) || !language) {
    return res.status(400).json({ message: 'lyrics array and language are required' });
  }

  const translatedLyrics = lyrics.map((line) => ({
    ...line,
    translations: {
      ...line.translations,
      [language]: line.translations?.[language] ?? line.original,
    },
  }));

  return res.status(200).json({ lyrics: translatedLyrics });
}

module.exports = {
  getSongs,
  getLyrics,
  translateLyrics,
};
