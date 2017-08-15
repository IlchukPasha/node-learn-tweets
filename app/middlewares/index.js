module.exports = {
  validators: {
    user_create: require('./validators/user_create'),
    user_update: require('./validators/user_update'),
    like_remove: require('./validators/like_remove'),
    user_email: require('./validators/user_email'),
    tweet: require('./validators/tweet')
  },
  auth: require('./auth'),
  tweet_owner: require('./tweet_owner'),
  like_repeat: require('./like_repeat'),
  role: require('./role'),
  image_upload: require('./image_upload'),
  user_current: require('./user_current'),
  user_update: require('./user_update'),
  user_exist: require('./user_exist')
};
