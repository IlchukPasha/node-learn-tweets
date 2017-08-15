const { allowed_by } = require('./../helpers');

module.exports = (req, res, next) => {
  let { roles, id } = req._user;
  let { id: pid } = req.params;
  if ( allowed_by(roles) || id === parseInt(pid)) {
    next();
  } else {
    return res.status(403).end();
  }
};
