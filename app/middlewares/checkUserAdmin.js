module.exports = user_access_role => {
  return function(req, res, next) {
    if (user_access_role === 'admin') {
      if (req._user.role === 'admin') {
        return next();
      } else {
        return res.status(403).end();
      }
    } else {
      if (req._user.role === 'admin' || req._user.id === parseInt(req.params.id)) {
        return next();
      } else {
        return res.status(403).end();
      }
    }
  };
};
