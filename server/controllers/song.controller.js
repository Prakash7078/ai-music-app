const songModel = require('../models/song.model');
const audiusService = require('../services/audius.service');
const lyricsService = require('../services/lyrics.service');
const translationService = require('../services/translation.service');

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

async function getFeaturedUsers(_req, res, next) {
  try {
    const users = await audiusService.getFeaturedUsers();

    return res.status(200).json({
      users: users.length > 0 ? users : songModel.getAllArtists(),
      source: users.length > 0 ? 'audius' : 'fallback',
    });
  } catch (error) {
    if (!process.env.AUDIUS_API_BEARER_TOKEN) {
      return res.status(200).json({
        users: songModel.getAllArtists(),
        source: 'fallback',
        message: 'Audius token not configured. Using local fallback artists.',
      });
    }

    return next(error);
  }
}

async function searchUsers(req, res, next) {
  const query = req.query.q?.toString().trim();

  if (!query) {
    return res.status(400).json({ message: 'q query parameter is required' });
  }

  try {
    const users = await audiusService.searchUsers(query);

    return res.status(200).json({
      users:
        users.length > 0
          ? users
          : songModel
              .getAllArtists()
              .filter((artist) =>
                `${artist.name} ${artist.handle}`.toLowerCase().includes(query.toLowerCase())
              ),
      source: users.length > 0 ? 'audius' : 'fallback',
    });
  } catch (error) {
    if (!process.env.AUDIUS_API_BEARER_TOKEN) {
      return res.status(200).json({
        users: songModel
          .getAllArtists()
          .filter((artist) =>
            `${artist.name} ${artist.handle}`.toLowerCase().includes(query.toLowerCase())
          ),
        source: 'fallback',
        message: 'Audius token not configured. Using local fallback artist search.',
      });
    }

    return next(error);
  }
}

async function streamTrack(req, res, next) {
  const { trackId } = req.params;

  if (!trackId) {
    return res.status(400).json({ message: 'trackId parameter is required' });
  }

  try {
    const streamUrl = await audiusService.getTrackStreamUrl(trackId);
    return res.redirect(streamUrl);
  } catch (error) {
    if (!process.env.AUDIUS_API_BEARER_TOKEN) {
      return res.status(400).json({
        message: 'Audius token not configured. Track streaming is unavailable.',
      });
    }

    return next(error);
  }
}

async function getLyrics(req, res, next) {
  const { songId, title, artist, album, durationMs } = req.query;

  if (!songId && !title) {
    return res.status(400).json({ message: 'songId or title query parameter is required' });
  }

  const lyrics = songId ? songModel.getSongLyrics(songId) : null;

  if (lyrics && lyrics.length > 0) {
    return res.status(200).json({ lyrics, source: 'catalog' });
  }

  try {
    const providerLyrics = await lyricsService.getTimedLyrics({
      id: songId,
      title,
      artist,
      album,
      durationMs,
    });

    if (providerLyrics?.lyrics?.length) {
      return res.status(200).json(providerLyrics);
    }

    return res.status(200).json({
      lyrics: songModel.generateSongLyrics({ songId, title, artist, durationMs }),
      source: 'generated',
    });
  } catch (error) {
    if (!title || !artist) {
      return next(error);
    }

    return res.status(200).json({
      lyrics: songModel.generateSongLyrics({ songId, title, artist, durationMs }),
      source: 'generated',
      message: 'Lyrics provider request failed. Using generated fallback lyrics.',
    });
  }
}

async function translateLyrics(req, res, next) {
  const { lyrics, language } = req.body;

  if (!Array.isArray(lyrics) || !language) {
    return res.status(400).json({ message: 'lyrics array and language are required' });
  }

  try {
    const translatedLyrics = await translationService.translateLyrics(lyrics, language);

    return res.status(200).json(translatedLyrics);
  } catch (error) {
    return res.status(200).json({
      lyrics: lyrics.map((line) => ({
        ...line,
        translations: {
          ...line.translations,
          [language]: line.translations?.[language] ?? line.original,
        },
      })),
      source: 'fallback',
      message:
        error instanceof Error
          ? `${error.message}. Using fallback translations.`
          : 'Translation provider failed. Using fallback translations.',
    });
  }
}

module.exports = {
  getSongs,
  getTrendingSongs,
  searchSongs,
  getFeaturedUsers,
  searchUsers,
  streamTrack,
  getLyrics,
  translateLyrics,
};
