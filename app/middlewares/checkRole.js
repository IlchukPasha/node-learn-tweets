const knex = require('./../libs/knex');

module.exports = function(req, res, next) {
  knex('tweets as t')
    .select('t.id', 't.user_id', 't.image')
    .where('t.id', req.params.id)
    .where('t.user_id', req._user.id)
    .count('* as c')
    .first()
    .then(tweet => {
      if (tweet.c || req._user.role === 'admin') {
        next();
      } else {
        res.status(403).end();
      }
    })
    .catch(next);
};
