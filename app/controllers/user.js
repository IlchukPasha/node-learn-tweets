const express = require('express');
const router = express.Router();

let User = require('./../models/user');

let {checkUserAdmin: checkUserAdminMdwr, validateUser: validateUserMdwr} = require('./../middlewares');

// only admin
router.get('/', checkUserAdminMdwr('admin'), function (req, res, next) {
  User.getList(function (err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
});

router.get('/:id', checkUserAdminMdwr('user'), function (req, res, next) {
  User.getById(req.params.id, function (err, user) {
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
router.post('/', checkUserAdminMdwr('admin'), validateUserMdwr, function (req, res, next) {
  User.insert(req.body, (err, user_id) => {
    if (err) {
      return next(err);
    }
    res.status(201).end();
  });
});

router.put('/:id', function (req, res, next) {
});

// only admin
router.delete('/:id', function (req, res, next) {
});

module.exports = router;
