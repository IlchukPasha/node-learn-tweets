const express = require('express');
const router = express.Router();

let Like = require('../models/like');
let Validator = require('../middlewares/validators/Validator');

const checkRepeatLikeMdwr = require('./../middlewares/index').checkRepeatLike;
const validateRemoveLikeMdwr = require('./../middlewares/index').validateRemoveLike;

router.post('/', checkRepeatLikeMdwr, function(req, res, next) {
  let like = {
    user_id: req._user.id,
    tweet_id: req.body.tweet_id
  };
  Like.insertLike(like, function(err, like_id) {
    if (err) {
      return next(err);
    }
    res.status(201).end();
  });
});

router.delete('/', validateRemoveLikeMdwr, function(req, res, next) {
  let like = {
    user_id: req._user.id,
    tweet_id: req.body.tweet_id
  };
  Like.removeLike(like, function(err, number_of_deleted) {
    if (err) {
      return next(err);
    }
    if (number_of_deleted === 0) {
      return res.status(404).end();
    }
    res.status(200).end();
  });
});

module.exports = router;
