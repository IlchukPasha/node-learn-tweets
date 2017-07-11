const bookshelf = require('../libs/bookshelf');
const knex = require('./../libs/knex');
const util = require('util');
const uuid = require('uuid/v4');
const path = require('path');

const Validator = require('./../middlewares/validators/Validator');

bookshelf.plugin('registry');

let Tweet = bookshelf.Model.extend(
  {
    tableName: 'tweets',
    user: function() {
      return this.belongsTo('User');
    },
    likes: function() {
      return this.hasMany('Like');
    }
  },
  {
    postTweetRulesWithImage: function() {
      return {
        message: 'required',
        image_type: 'in:image/png,image/jpeg,image/jpg'
      };
    },
    postTweetRulesWithoutImage: function() {
      return {
        message: 'required'
      };
    },
    postTweetMessages: function() {
      return {
        'required.message': 'Message is required',
        'in.image_type': 'Image type must be in: png,jpeg'
      };
    },
    insertTweet: function(tweet, cb) {
      knex('tweets')
        .insert(tweet)
        .then(function(tweet_id) {
          cb(null, tweet_id);
        })
        .catch(function(err) {
          cb(err);
        });
    },
    updateTweet: function(tweet_id, tweet, cb) {
      knex('tweets as tweet')
        .where('tweet.id', tweet_id)
        .update(tweet)
        .then(function(number_upd_tweets) {
          cb(null, number_upd_tweets);
        })
        .catch(function(err) {
          cb(err);
        });
    },
    deleteTweet: function(tweet_id, cb) {
      knex('tweets')
        .where('tweets.id', tweet_id)
        .del()
        .then(function(number_of_deleted) {
          cb(null, number_of_deleted);
        })
        .catch(function(err) {
          cb(err);
        });
    },
    generatePath: function(image) {
      let image_name = util.format('%s%s', uuid(), path.extname(image.originalFilename));
      return 'public/images/uploaded/' + image_name;
    },
    generateValidate: function(image, message) {
      let image_type = image ? image.type : '';

      let validateObject = {
        message: message
      };

      let validate = null;

      if (image) {
        validateObject.image_type = image_type;
        validate = new Validator(validateObject, Tweet.postTweetRulesWithImage(), Tweet.postTweetMessages());
      } else {
        validate = new Validator(validateObject, Tweet.postTweetRulesWithoutImage(), Tweet.postTweetMessages());
      }
      return validate;
    }
  }
);

module.exports = bookshelf.model('Tweet', Tweet);
