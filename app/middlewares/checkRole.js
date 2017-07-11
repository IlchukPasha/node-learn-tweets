const knex = require('./../libs/knex');

module.exports = function(req, res, next) {
  knex('tweets as t')
    .select('t.id', 't.user_id', 't.image')
    .where('t.id', req.params.id)
    .first()
    .then(function(tweet) {
      if (!tweet) {
        return res.status(404).end();
      }
      if (req._user.role === 'admin' || req._user.id === tweet.user_id) {
        req._image = tweet.image;
        return next();
      }
      res.status(403).end();
    })
    .catch(next);
};
