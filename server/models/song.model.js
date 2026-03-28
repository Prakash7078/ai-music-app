const { songs } = require('../data/song.data');

function getAllSongs() {
  return songs;
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
  getSongById,
  getSongLyrics,
};
