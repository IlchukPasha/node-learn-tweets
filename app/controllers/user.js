const express = require('express');
const router = express.Router();

let User = require('./../models/user');

let {
  role: roleMdwr,
  current_user: current_user_mdwr,
  user_exist: user_exist_mdwr,
  validators: { user_create: user_create_validate_mdwr, user_update: user_update_validate_mdwr }
} = require('./../middlewares');

// only admin
router.get('/', roleMdwr(['admin']), (req, res, next) => {
  User.getList(function(err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
});

router.get('/:id', roleMdwr(['admin', 'user']), current_user_mdwr, (req, res, next) => {
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
router.post('/', roleMdwr(['admin']), user_create_validate_mdwr, (req, res, next) => {
  User.insert(req.body, err => {
    if (err) {
      return next(err);
    }
    res.status(201).end();
  });
});

router.put(
  '/:id',
  user_exist_mdwr,
  user_update_validate_mdwr,
  roleMdwr(['admin', 'user']),
  current_user_mdwr,
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
router.delete('/:id', user_exist_mdwr, roleMdwr(['admin']), (req, res, next) => {
  User.remove(req.params.id, err => {
    if (err) {
      return next(err);
    }
    res.status(204).end();
  });
});

module.exports = router;
