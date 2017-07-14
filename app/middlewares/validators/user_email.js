const knex = require('./../../libs/knex');

module.exports = (req, res, next) => {
  knex('users as u')
    .where('u.email', req.body.email)
    .where('u.id', '!=', req.params.id)
    .count('* as count')
    .first()
    .then(user => {
      if (user.count) {
        return res.status(400).send({ errors: { email: 'This email has already been taken.' } });
      } else {
        return next();
      }
    });
};
