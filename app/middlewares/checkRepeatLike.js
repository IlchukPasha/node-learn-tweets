let knex = require('./../libs/knex');
let Like = require('../models/like');
let Validator = require('../middlewares/validators/Validator');

module.exports = function(req, res, next) {

  let validate = new Validator(req.body, Like.likeRules(), Like.likeMessages());

  validate.passes(function() {
    knex('likes as l')
      .where('l.user_id', req._user.id)
      .where('l.tweet_id', req.body.tweet_id)
      .first()
      .then(function(like) {
        if (like) {
          return res.status(400).send('you already like this tweet');
        }
        next();
      })
      .catch(next);
  });
  validate.fails(function() {
    res.status(400).send(validate.errors);
  });
};
