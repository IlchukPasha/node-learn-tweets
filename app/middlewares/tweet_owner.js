const knex = require('./../libs/knex');
const { findIndex } = require('lodash');

module.exports = function(req, res, next) {
  if (
    findIndex(req._user.roles, item => {
      return item === 'admin';
    }) >= 0
  ) {
    next();
  } else {
    knex('tweets as t')
      .select('t.id', 't.user_id', 't.image')
      .where('t.id', req.params.id)
      .where('t.user_id', req._user.id)
      .first()
      .then(tweet => {
        if (tweet) {
          req._image_to_delete = tweet.image;
          next();
        } else {
          res.status(403).end();
        }
      })
      .catch(next);
  }
};
