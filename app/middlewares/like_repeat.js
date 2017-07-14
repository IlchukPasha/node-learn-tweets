let knex = require('./../libs/knex');
let Like = require('../models/like');
let Validator = require('../middlewares/validators/Validator');

module.exports = function(req, res, next) {
  let validate = new Validator(req.body, Like.rules.like, Like.messages.like);

  validate.passes(function() {
    knex('likes as l')
      .where('l.user_id', req._user.id)
      .where('l.tweet_id', req.body.tweet_id)
      .count('* as c')
      .first()
      .then(like => {
        if (like.c !== 0) {
          return res.status(409).send({ message: 'like is exist' });
        }
        next();
      })
      .catch(next);
  });
  validate.fails(function() {
    res.status(400).send(validate.errors);
  });
};
