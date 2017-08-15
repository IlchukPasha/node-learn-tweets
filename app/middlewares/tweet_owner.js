const knex = require('./../libs/knex');

const { allowed_by } = require('./../helpers');

module.exports = function(req, res, next) {
  let { id, roles } = req._user;

  knex('tweets as t')
    .select('t.user_id', 't.image')
    .where('t.id', req.params.id)
    .first()
    .then(tweet => {
      if (tweet && (allowed_by(roles) || tweet.user_id === id)) {
        req._image_to_delete = tweet.image;
        next();
      } else {
        res.status(403).end();
      }
    })
    .catch(next);
};
