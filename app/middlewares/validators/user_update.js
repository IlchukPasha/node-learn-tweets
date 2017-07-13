const User = require('./../../models/user');
const Validator = require('./../../middlewares/validators/Validator');

module.exports = (req, res, next) => {
  let rules = {
    email: 'required|email|unique_except_current_user',
    password: 'required|min:5',
    first_name: 'required|min:5|max:30',
    last_name: 'required|min:5|max:30'
  };

  if (req.body.roles) {
    rules['roles'] = 'roles_exist';
  }
  let validate = new Validator(req.body, rules, User.messages.signup);

  validate.passes(() => {
    next();
  });

  validate.fails(() => {
    res.status(400).send(validate.errors);
  });
};
