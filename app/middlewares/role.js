const { findIndex } = require('lodash');

module.exports = roles => {
  return (req, res, next) => {
    if (
      findIndex(roles, item => {
        return req._user.roles.includes(item);
      }) >= 0
    ) {
      next();
    } else {
      return res.status(403).end();
    }
  };
};
