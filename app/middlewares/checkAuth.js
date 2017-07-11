const jwt = require('jsonwebtoken');
const env = require('./../config');
const Validator = require('./validators/Validator');
const User = require('./../models/user');

module.exports = function(req, res, next) {
  const rules = {
    authorization: 'required|min:32'
  };
  const validate = new Validator(req.headers, rules, {
    'required.authorization': 'The authorization header is required',
    'min.authorization': 'The authorization header is invalid'
  });

  if (validate.fails()) {
    res.status(401).send(validate.errors);
  } else {
    jwt.verify(req.headers.authorization, env.secret, function(err, decoded) {
      if (err) {
        return res.status(401).end();
      }
      if (decoded) {
        User.getUserById(decoded.id, function(err, user) {
          if (err) return next(err);
          if (!user) return next();
          req._user = user;
          next();
        });
      }
    });
  }
};
