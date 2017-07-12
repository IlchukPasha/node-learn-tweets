const User = require('./../../models/user');
const Validator = require('./../../middlewares/validators/Validator');

module.exports = (req, res, next) => {
  let validate = new Validator(req.body, User.rules.create, User.messages.signup);

  validate.passes(() => {
    next();
  });

  validate.fails(() => {
    res.status(400).send(validate.errors);
  });
};
