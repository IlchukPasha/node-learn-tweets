const knex = require('./../libs/knex');
const { findIndex } = require('lodash');

module.exports = function(req, res, next) {
  knex('tweets as t')
    .select('t.id', 't.user_id', 't.image')
    .where('t.id', req.params.id)
    .where('t.user_id', req._user.id)
    .count('* as c')
    .first()
    .then(tweet => {
      if (
        findIndex(req._user.roles, item => {
          return item === 'admin';
        }) >= 0
      ){
        next();
      }else{
        if (tweet.c) {
          next();
        } else {
          res.status(403).end();
        }
      }

    })
    .catch(next);
};
