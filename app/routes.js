var authCtrl = require('./controllers/index').auth;
var tweetsCtrl = require('./controllers/index').tweets;
var likesCtrl = require('./controllers/index').likes;
var usersCtrl = require('./controllers/index').users;

var checkAuthMdwr = require('./middlewares/index').checkAuth;

module.exports = function(app) {
  app.use('/api/v1', authCtrl);
  app.use('/api/v1/tweets', checkAuthMdwr, tweetsCtrl);
  app.use('/api/v1/likes', checkAuthMdwr, likesCtrl);
  app.use('/api/v1/users', checkAuthMdwr, usersCtrl);
};
