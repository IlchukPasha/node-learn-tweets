const express = require('express');
const router = express.Router();

let User = require('./../models/user');

let checkIsAdminMdwr = require('./../middlewares/index').checkIsAdmin;
let checkGetUserMdwr = require('./../middlewares/index').checkGetUser;

// only admin
router.get('/', checkIsAdminMdwr, function(req, res, next) {
  User.getAllUsers(function(err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
});

router.get('/:id', checkGetUserMdwr, function(req, res, next) {
  User.getUserById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    res.json(user);
  });
});

// only admin
router.post('/', function(req, res, next) {});

router.put('/:id', function(req, res, next) {});

// only admin
router.delete('/:id', function(req, res, next) {});

module.exports = router;
