const express = require('express');
const router = express.Router();
const knex = require('./../libs/knex');
const util = require('util');
const uuid = require('uuid/v4');
const fs = require('fs');
const Validator = require('./../middlewares/validators/Validator');

const {
  checkRole: checkRoleMdwr,
  checkImageUpload: checkImageUploadMdwr,
  validateTweet: validateTweetMdwr
} = require('../middlewares');

const Tweet = require('../models/tweet');

router.get('/', (req, res, next) => {
  knex('tweets')
    .then(tweets => {
      res.json(tweets);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  knex('tweets as tweet')
    .where('tweet.id', req.params.id)
    .first()
    .then(tweet => {
      if (tweet) {
        return res.json(tweet);
      }
      res.status(404).send();
    })
    .catch(next);
});

router.post('/', validateTweetMdwr, checkImageUploadMdwr, (req, res, next) => {
  let tweet = {
    message: req.body.message,
    image: req._targetPath || null,
    user_id: req._user.id
  };
  Tweet.insert(tweet, (err, tweet_id) => {
    if (err) {
      return next(err);
    }
    res.status(201).end();
  });
});

router.put('/:id', checkRoleMdwr, validateTweetMdwr, checkImageUploadMdwr, (req, res, next) => {
  let tweet = {
    message: req.body.message
  };
  if (req._targetPath) {
    tweet.image = req._targetPath;
  }
  Tweet.update(req.params.id, tweet, (err, number_upd_tweets) => {
    if (err) {
      return next(err);
    }
    res.status(200).end();
  });
});

router.delete('/:id', checkRoleMdwr, (req, res, next) => {
  Tweet.remove(req.params.id, (err, number_of_deleted) => {
    if (err) {
      return next(err);
    }
    if (fs.existsSync(req._image)) {
      fs.unlink(req._image, err => {
        if (err) {
          return next(err);
        }
        res.status(204).end();
      });
    } else {
      res.status(204).end();
    }
  });
});

module.exports = router;
