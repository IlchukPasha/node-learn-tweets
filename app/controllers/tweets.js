const express = require('express');
const router = express.Router();
const knex = require('./../libs/knex');
const path = require('path');
const util = require('util');
const uuid = require('uuid/v4');
const fs = require('fs');
const Validator = require('./../middlewares/validators/Validator');
const checkRoleMdwr = require('../middlewares/index').checkRole;

const Tweet = require('../models/tweet');

router.get('/', function(req, res, next) {
  knex('tweets')
    .then(function(tweets) {
      res.json(tweets);
    })
    .catch(next);
});

router.get('/:id', function(req, res, next) {
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

router.post('/', function(req, res, next) {
  let validate = Tweet.generateValidate(req.files.image, req.body.message);

  if (validate.passes()) {
    if (req.files.image) {
      let targetPath = Tweet.generatePath(req.files.image);
      fs.rename(req.files.image.path, targetPath, function(err) {
        if (err) {
          return next(err);
        }
        let tweet = {
          message: req.body.message,
          image: targetPath,
          user_id: req._user.id
        };
        Tweet.insertTweet(tweet, function(err, tweet_id) {
          if (err) {
            return next(err);
          }
          res.status(201).end();
        });
      });
    } else {
      let tweet = {
        message: req.body.message,
        user_id: req._user.id
      };
      Tweet.insertTweet(tweet, function(err, tweet_id) {
        if (err) {
          return next(err);
        }
        res.status(201).end();
      });
    }
  } else {
    res.status(400).send(validate.errors);
  }
});

router.put('/:id', checkRoleMdwr, function(req, res, next) {
  let validate = Tweet.generateValidate(req.files.image, req.body.message);

  if (validate.passes()) {
    if (req.files.image) {
      let targetPath = Tweet.generatePath(req.files.image);
      fs.rename(req.files.image.path, targetPath, function(err) {
        if (err) {
          return next(err);
        }
        let tweet = {
          message: req.body.message,
          image: targetPath
        };
        Tweet.updateTweet(req.params.id, tweet, function(err, number_upd_tweets) {
          if (err) {
            return next(err);
          }
          if (fs.existsSync(req._image)) {
            fs.unlink(req._image, function(err) {
              if (err) {
                return next(err);
              }
              res.status(200).end();
            });
          } else {
            res.status(200).end();
          }
        });
      });
    } else {
      console.log('else');
      let tweet = {
        message: req.body.message
      };
      Tweet.updateTweet(req.params.id, tweet, function(err, number_upd_tweets) {
        if (err) {
          return next(err);
        }
        res.status(200).end();
      });
    }
  } else {
    res.status(400).send(validate.errors);
  }
});

router.delete('/:id', checkRoleMdwr, function(req, res, next) {
  Tweet.deleteTweet(req.params.id, function(err, number_of_deleted) {
    if (err) {
      return next(err);
    }
    if (fs.existsSync(req._image)) {
      fs.unlink(req._image, function(err) {
        if (err) {
          return next(err);
        }
        res.status(200).end();
      });
    } else {
      res.status(200).end();
    }
  });
});

module.exports = router;
