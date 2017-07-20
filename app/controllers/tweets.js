const express = require('express');
const router = express.Router();
const knex = require('./../libs/knex');
const util = require('util');
const uuid = require('uuid/v4');
const fs = require('fs');
const path = require('path');
const { parallel } = require('async');
const Validator = require('./../middlewares/validators/Validator');
const { image_path } = require('./../config');

const {
  tweet_owner: tweet_owner_mw,
  image_upload: image_upload_mw,
  validators: { tweet: validate_tweet_mw }
} = require('../middlewares');

const Tweet = require('../models/tweet');

router.get('/', (req, res, next) => {
  let limit = req.query.limit ? req.query.limit : 5;
  let page = req.query.page ? req.query.page : 1;
  parallel(
    {
      count: callback => {
        knex('tweets as t').count('t.id as c').first().asCallback(callback);
      },
      list: callback => {
        knex('tweets').limit(limit).offset(page * limit - limit).asCallback(callback);
      }
    },
    (err, results) => {
      if (err) {
        return res.status(400).end();
      }
      return res.json({
        count: results.count.c,
        data: results.list
      });
    }
  );
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

router.post('/', validate_tweet_mw, image_upload_mw, (req, res, next) => {
  if (process.env.NODE_ENV !== 'testing') {
    if (req._targetPath) {
      req._targetPath = path.join(image_path, path.basename(req._targetPath));
    }
  }
  let tweet = {
    message: req.body.message,
    image: req._targetPath || null,
    user_id: req._user.id
  };
  Tweet.insert(tweet, err => {
    if (err) {
      return next(err);
    }
    res.status(201).end();
  });
});

router.put('/:id', tweet_owner_mw, validate_tweet_mw, image_upload_mw, (req, res, next) => {
  let tweet = {
    message: req.body.message
  };
  if (req._targetPath) {
    tweet.image = req._targetPath;
  }
  Tweet.update(req.params.id, tweet, err => {
    if (err) {
      return next(err);
    }
    if (fs.existsSync(req._image_to_delete)) {
      fs.unlink(req._image_to_delete, () => {});
    }
    res.status(200).end();
  });
});

router.delete('/:id', tweet_owner_mw, (req, res, next) => {
  Tweet.remove(req.params.id, err => {
    if (err) {
      return next(err);
    }
    if (fs.existsSync(req._image_to_delete)) {
      fs.unlink(req._image_to_delete, err => {
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
