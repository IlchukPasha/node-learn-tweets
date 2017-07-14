const { findIndex } = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

const { allowed_by } = require('./../helpers');

module.exports = (req, res, next) => {
  let new_user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt)
  };
  if (allowed_by(req._user.roles)) {
    if (req.body.roles) {
      new_user['roles'] = req.body.roles.join();
    }
  }
  req._update_user = new_user;
  next();
};
