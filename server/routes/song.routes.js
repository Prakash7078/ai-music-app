const express = require('express');

const songController = require('../controllers/song.controller');

const router = express.Router();

router.get('/songs', songController.getSongs);
router.get('/discover/trending', songController.getTrendingSongs);
router.get('/search', songController.searchSongs);
router.get('/tracks/:trackId/stream', songController.streamTrack);
router.get('/lyrics', songController.getLyrics);
router.post('/translate-lyrics', songController.translateLyrics);

module.exports = router;
