let { auth: authCtrl, tweets: tweetsCtrl, likes: likesCtrl, users: usersCtrl } = require('./controllers');

let { auth: auth_mdwr } = require('./middlewares');

module.exports = function(app) {
  app.use('/api/v1', authCtrl);
  app.use('/api/v1/tweets', auth_mdwr, tweetsCtrl);
  app.use('/api/v1/likes', auth_mdwr, likesCtrl);
  app.use('/api/v1/users', auth_mdwr, usersCtrl);
};
