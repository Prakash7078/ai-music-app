function errorMiddleware(error, _req, res, _next) {
  console.error(error);

  return res.status(500).json({
    message: error.message || 'Internal server error',
  });
}

module.exports = { errorMiddleware };
