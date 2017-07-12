let {
  auth: authCtrl,
  tweets: tweetsCtrl,
  likes: likesCtrl,
  users: usersCtrl,
  roles: rolesCtrl
} = require('./controllers');

let checkAuthMdwr = require('./middlewares/index').checkAuth;

module.exports = function(app) {
  app.use('/api/v1', authCtrl);
  app.use('/api/v1/tweets', checkAuthMdwr, tweetsCtrl);
  app.use('/api/v1/likes', checkAuthMdwr, likesCtrl);
  app.use('/api/v1/users', checkAuthMdwr, usersCtrl);
  app.use('/api/v1/roles', checkAuthMdwr, rolesCtrl);
};
