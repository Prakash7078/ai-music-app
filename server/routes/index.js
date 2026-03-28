const express = require('express');

const { getHealth } = require('../controllers/health.controller');
const songRoutes = require('./song.routes');

const router = express.Router();

router.get('/health', getHealth);
router.use('/', songRoutes);

module.exports = router;
