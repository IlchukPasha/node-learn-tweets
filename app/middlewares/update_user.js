const { findIndex } = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

module.exports = (req, res, next) => {
  let new_user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt)
  };
  if (
    findIndex(req._user.roles, item => {
      return item === 'admin';
    }) >= 0
  ) {
    if (req.body.roles) {
      new_user['roles'] = req.body.roles.join();
    }
  }
  req._update_user = new_user;
  next();
};
