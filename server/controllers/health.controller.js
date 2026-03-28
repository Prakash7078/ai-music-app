function getHealth(_req, res) {
  return res.status(200).json({
    status: 'ok',
    message: 'AI Music App backend is running',
  });
}

module.exports = { getHealth };
