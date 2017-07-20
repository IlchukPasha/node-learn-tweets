const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

let User = require('./../models/user');

let {
  role: role_mw,
  user_current: user_current_mw,
  user_update: user_update_mw,
  user_exist: user_exist_mw,
  validators: {
    user_create: user_create_validate_mw,
    user_update: user_update_validate_mw,
    user_email: user_email_validate_mw
  }
} = require('./../middlewares');

// only admin
router.get('/', role_mw(['admin']), (req, res, next) => {
  User.getList(function(err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
});

router.get('/:id', user_current_mw, (req, res, next) => {
  User.getById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).end();
    }
    res.json(user);
  });
});

// only admin
router.post('/', role_mw(['admin']), user_create_validate_mw, (req, res, next) => {
  req.body.password = bcrypt.hashSync(req.body.password, salt);
  User.insert(req.body, err => {
    if (err) {
      return next(err);
    }
    res.status(201).end();
  });
});

router.put(
  '/:id',
  user_exist_mw,
  user_update_validate_mw,
  user_email_validate_mw,
  user_current_mw,
  user_update_mw,
  (req, res, next) => {
    User.update(req.params.id, req._update_user, err => {
      if (err) {
        return next(err);
      }
      res.status(200).end();
    });
  }
);

// only admin
router.delete('/:id', user_exist_mw, role_mw(['admin']), (req, res, next) => {
  User.remove(req.params.id, err => {
    if (err) {
      return next(err);
    }
    res.status(204).end();
  });
});

module.exports = router;
