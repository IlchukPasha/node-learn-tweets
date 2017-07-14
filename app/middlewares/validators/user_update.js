const User = require('./../../models/user');
const Validator = require('./../../middlewares/validators/Validator');
const { roles: env_roles } = require('./../../config');
const { findIndex } = require('lodash');

module.exports = (req, res, next) => {
  let rules = {
    email: 'required|email',
    password: 'required|min:5',
    first_name: 'required|min:5|max:30',
    last_name: 'required|min:5|max:30'
  };

  if (
    findIndex(req._user.roles, item => {
      return item === 'admin';
    }) >= 0
  ) {
    if (req.body.roles) {
      rules['roles'] = 'array|in:' + env_roles.join();
    }
  }

  let validate = new Validator(req.body, rules, User.messages.signup);

  validate.passes(() => {
    next();
  });

  validate.fails(() => {
    res.status(400).send(validate.errors);
  });
};
