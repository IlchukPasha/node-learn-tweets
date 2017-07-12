const express = require('express');
const router = express.Router();

let Role = require('./../models/role');

router.get('/', function(req, res, next) {
  Role.getList(function(err, roles) {
    if (err) {
      return next(err);
    }
    res.json(roles);
  });
});

module.exports = router;
