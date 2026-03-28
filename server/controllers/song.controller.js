const songModel = require('../models/song.model');
const audiusService = require('../services/audius.service');

function getSongs(_req, res) {
  return res.status(200).json({ songs: songModel.getAllSongs() });
}

async function getTrendingSongs(_req, res, next) {
  try {
    const songs = await audiusService.getTrendingSongs();

    if (songs.length === 0) {
      return res.status(200).json({
        songs: songModel.getAllSongs(),
        source: 'fallback',
      });
    }

    return res.status(200).json({
      songs,
      source: 'audius',
    });
  } catch (error) {
    if (!process.env.AUDIUS_API_BEARER_TOKEN) {
      return res.status(200).json({
        songs: songModel.getAllSongs(),
        source: 'fallback',
        message: 'Audius token not configured. Using local fallback songs.',
      });
    }

    return next(error);
  }
}

async function searchSongs(req, res, next) {
  const query = req.query.q?.toString().trim();

  if (!query) {
    return res.status(400).json({ message: 'q query parameter is required' });
  }

  try {
    const songs = await audiusService.searchSongs(query);

    return res.status(200).json({
      songs,
      source: 'audius',
    });
  } catch (error) {
    if (!process.env.AUDIUS_API_BEARER_TOKEN) {
      const fallbackSongs = songModel
        .getAllSongs()
        .filter((song) =>
          `${song.title} ${song.artist} ${song.album}`.toLowerCase().includes(query.toLowerCase())
        );

      return res.status(200).json({
        songs: fallbackSongs,
        source: 'fallback',
        message: 'Audius token not configured. Using local fallback search.',
      });
    }

    return next(error);
  }
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
  getTrendingSongs,
  searchSongs,
  getLyrics,
  translateLyrics,
};
