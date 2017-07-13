const knex = require('./../libs/knex');

module.exports = (req, res, next) => {
  knex('users as u')
    .where('u.id', req.params.id)
    .count('* as count')
    .first()
    .then(user => {
      if(user.count){
        return next();
      }else{
        return res.status(404).end();
      }
    }).catch(next);
};