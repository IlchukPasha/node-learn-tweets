const { findIndex } = require('lodash');

module.exports = (req, res, next) => {
  if (
    findIndex(req._user.roles, item => {
      return item === 'admin';
    }) >= 0
  ) {
    next();
  } else {
    if (req._user.id === parseInt(req.params.id)) {
      return next();
    } else {
      return res.status(403).end();
    }
  }
};
