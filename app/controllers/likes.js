const express = require('express');
const router = express.Router();

let Like = require('../models/like');
let Validator = require('../middlewares/validators/Validator');

const { like_repeat: like_repeat_mw, validators: { like_remove: like_remove_mw } } = require('./../middlewares');

router.post('/', like_repeat_mw, function(req, res, next) {
  let like = {
    user_id: req._user.id,
    tweet_id: req.body.tweet_id
  };
  Like.insert(like, err => {
    if (err) {
      return next(err);
    }
    res.status(201).end();
  });
});

router.delete('/', like_remove_mw, function(req, res, next) {
  let like = {
    user_id: req._user.id,
    tweet_id: req.body.tweet_id
  };
  Like.remove(like, function(err, number_of_deleted) {
    if (err) {
      return next(err);
    }
    if (number_of_deleted === 0) {
      return res.status(404).end();
    }
    res.status(204).end();
  });
});

module.exports = router;
