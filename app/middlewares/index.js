module.exports = {
  validators: {
    user_create: require('./validators/user_create'),
    user_update: require('./validators/user_update'),
    remove_like: require('./validators/remove_like'),
    tweet: require('./validators/tweet')
  },
  auth: require('./auth'),
  tweet_owner: require('./tweet_owner'),
  repeat_like: require('./repeat_like'),
  role: require('./role'),
  image_upload: require('./image_upload'),
  current_user: require('./current_user'),
  user_exist: require('./user_exist')
};
