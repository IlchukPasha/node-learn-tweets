module.exports = {
  checkAuth: require('./checkAuth'),
  checkRole: require('./checkRole'),
  checkRepeatLike: require('./checkRepeatLike'),
  checkUserAdmin: require('./checkUserAdmin'),
  checkGetUser: require('./checkGetUser'),
  checkImageUpload: require('./checkImageUpload'),
  validateRemoveLike: require('./validators/validateRemoveLike'),
  validateTweet: require('./validators/validateTweet')
};
