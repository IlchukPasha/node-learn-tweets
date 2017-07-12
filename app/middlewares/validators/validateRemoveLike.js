let knex = require('../../libs/knex');
let Like = require('../../models/like');
let Validator = require('./Validator');

module.exports = function(req, res, next) {
  let validate = new Validator(req.body, Like.rules.remove, Like.messages.like);
  if (validate.passes()) {
    next();
  } else {
    res.status(400).send(validate.errors);
  }
};
