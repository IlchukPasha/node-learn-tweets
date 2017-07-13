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
    rules: {
      with_image: {
        message: 'required',
        image_type: 'in:image/png,image/jpeg,image/jpg'
      },
      without_image: {
        message: 'required'
      }
    },

    messages: {
      tweet: {
        'required.message': 'Message is required',
        'in.image_type': 'Image type must be in: png,jpeg'
      }
    },

    insert: function(tweet, cb) {
      knex('tweets')
        .insert(tweet)
        .then(function(tweet_id) {
          cb(null, tweet_id);
        })
        .catch(function(err) {
          cb(err);
        });
    },
    update: function(tweet_id, tweet, cb) {
      knex('tweets as tweet')
        .where('tweet.id', tweet_id)
        .update(tweet)
        .then( () => {
          cb(null);
        })
        .catch(function(err) {
          cb(err);
        });
    },
    remove: function(tweet_id, cb) {
      knex('tweets')
        .where('tweets.id', tweet_id)
        .del()
        .then( () => {
          cb(null);
        })
        .catch(cb);
    },

    generatePath: image => {
      let image_name = util.format('%s%s', uuid(), path.extname(image.originalFilename));
      return 'public/images/uploaded/' + image_name;
    }
  }
);

module.exports = bookshelf.model('Tweet', Tweet);
