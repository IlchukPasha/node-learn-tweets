const Validator = require('validatorjs');
const knex = require('./../../libs/knex');

Validator.registerAsync('unique', function(email, attribute, req, passes) {
  knex('users as u')
    .where('u.email', email)
    .first()
    .then(function(user) {
      passes(!user, 'This email has already been taken.');
    })
    .catch(function(err) {
      passes(false, 'error in validation');
    });
});

Validator.registerAsync('user_exist', function(user_id, attribute, req, passes) {
  knex('users as u')
    .where('u.id', user_id)
    .first()
    .count('* as c')
    .then(function(user) {
      passes(user.c === 1, 'This user not exist.');
    })
    .catch(function(err) {
      passes(false, 'error in validation');
    });
});

Validator.registerAsync('tweet_exist', function(tweet_id, attribute, req, passes) {
  knex('tweets as t')
    .where('t.id', tweet_id)
    .first()
    .count('* as c')
    .then(function(tweet) {
      passes(tweet.c === 1, 'This tweet not exist.');
    })
    .catch(function(err) {
      passes(false, 'error in validation');
    });
});

Validator.registerAsync('role_exist', function(role_id, attribute, req, passes) {
  knex('roles as r')
    .where('r.id', role_id)
    .first()
    .count('* as c')
    .then(function(role) {
      passes(role.c === 1, 'This role not exist.');
    })
    .catch(function(err) {
      passes(false, 'error in validation');
    });
});

module.exports = Validator;
