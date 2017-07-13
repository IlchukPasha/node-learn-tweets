const { findIndex } = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

module.exports = (req, res, next) => {
  let new_user = null;
  if (
    findIndex(req._user.roles, item => {
      return item === 'admin';
    }) >= 0
  ) {
    new_user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt)
    };
    if (req.body.roles) {
      new_user['roles'] = req.body.roles;
    }
    req._update_user = new_user;
    next();
  } else {
    if (req._user.id === parseInt(req.params.id)) {
      new_user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt)
      };
      req._update_user = new_user;
      return next();
    } else {
      return res.status(403).end();
    }
  }
};
