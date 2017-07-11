const bookshelf = require('../libs/bookshelf');
const knex = require('./../libs/knex');
bookshelf.plugin('registry');

let Like = bookshelf.Model.extend(
  {
    tableName: 'likes',
    user: function() {
      return this.belongsTo('User');
    },
    tweet: function() {
      return this.belongsTo('Tweet');
    }
  },
  {
    likeRules: function() {
      return {
        tweet_id: 'required|tweet_exist'
      };
    },
    likeRemoveRules: function() {
      return {
        tweet_id: 'required'
      };
    },
    likeMessages: function() {
      return {
        'required.tweet_id': 'Tweet id is required'
      };
    },
    insertLike: function(like, cb) {
      knex('likes')
        .insert(like)
        .then(function(like_id) {
          cb(null, like_id);
        })
        .catch(function(err) {
          cb(err);
        });
    },
    removeLike: function(like, cb) {
      knex('likes')
        .where('likes.user_id', like.user_id)
        .where('likes.tweet_id', like.tweet_id)
        .del()
        .then(function(number_of_deleted) {
          cb(null, number_of_deleted);
        })
        .catch(function(err) {
          cb(err);
        });
    }
  }
);

module.exports = bookshelf.model('Like', Like);
