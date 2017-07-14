const knex = require('./../libs/knex');

const { allowed_by } = require('./../helpers');

module.exports = function(req, res, next) {
  let { id, roles } = req._user;

  knex('tweets as t')
    .select('t.user_id', 't.image')
    .where('t.id', req.params.id)
    .first()
    .then(tweet => {
      if (tweet && (tweet.user_id === id || allowed_by(roles))) {
        req._image_to_delete = tweet.image;
        next();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
};
