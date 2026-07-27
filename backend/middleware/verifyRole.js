exports.verifyOrganizer = (req, res, next) => {
  if (req.auth?.role !== 'Organizer') {
    return res.status(403).json({ success: false, message: 'Organizer access required' });
  }
  next();
};

exports.verifyUser = (req, res, next) => {
  if (req.auth?.role !== 'User') {
    return res.status(403).json({ success: false, message: 'User access required' });
  }
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (req.auth?.role !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};