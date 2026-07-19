function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'A record with this value already exists' });
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error'
  });
}

module.exports = { notFound, errorHandler };
