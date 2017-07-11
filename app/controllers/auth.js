const express = require('express');
const router = express.Router();
const knex = require('./../libs/knex');
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);
const env = require('./../config');
const jwt = require('jsonwebtoken');
const Validator = require('./../middlewares/validators/Validator');

const User = require('../models/user');
const Role = require('../models/role');

router.post('/signin', function(req, res, next) {
  let validate = new Validator(req.body, User.rules.signin, User.signinMessages());

  if (validate.passes()) {
    knex('users as u')
      .select('u.id', 'u.password')
      .where('u.email', req.body.email)
      .first()
      .then(function(user) {
        if (user) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            let token = jwt.sign({ id: user.id }, env.secret, { expiresIn: '120d' });

            res.json({ token });
          } else {
            res.status(401).send();
          }
        } else {
          res.status(401).send();
        }
      })
      .catch(function(err) {
        next(err);
      });
  } else {
    res.status(400).send(validate.errors);
  }
});

router.post('/signup', function(req, res, next) {
  var validate = new Validator(req.body, User.signupRules(), User.signupMessages());

  // run only one callback from passes or from fails
  validate.passes(function() {
    Role.getRoleByTitle('user', function(err, role) {
      if (err) {
        return next(err);
      }
      var user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        role_id: role.id
      };

      knex('users')
        .insert(user)
        .then(function(user_id) {
          var token = jwt.sign({ id: user_id[0] }, env.secret, { expiresIn: '120d' });
          res.status(201).json({ token });
        })
        .catch(next);
    });
  });

  validate.fails(function() {
    res.status(400).send(validate.errors);
  });
});

module.exports = router;
