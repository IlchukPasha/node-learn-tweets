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
    rules: {
      like:{
        tweet_id: 'required|tweet_exist'
      },
      remove: {
        tweet_id: 'required'
      }
    },

    messages: {
      like: {
        'required.tweet_id': 'Tweet id is required'
      }
    },

    insert: function(like, cb) {
      knex('likes')
        .insert(like)
        .then(() => {
          cb();
        })
        .catch(cb);
    },
    remove: function(like, cb) {
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
