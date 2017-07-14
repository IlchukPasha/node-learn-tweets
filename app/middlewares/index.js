module.exports = {
  validators: {
    user_create: require('./validators/user_create'),
    user_update: require('./validators/user_update'),
    remove_like: require('./validators/remove_like'),
    user_email: require('./validators/user_email'),
    tweet: require('./validators/tweet')
  },
  auth: require('./auth'),
  tweet_owner: require('./tweet_owner'),
  repeat_like: require('./repeat_like'),
  role: require('./role'),
  image_upload: require('./image_upload'),
  image_delete: require('./image_delete'),
  current_user: require('./current_user'),
  update_user: require('./update_user'),
  user_exist: require('./user_exist')
};
