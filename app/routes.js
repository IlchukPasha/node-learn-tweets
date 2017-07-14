let { auth: authCtrl, tweets: tweetsCtrl, likes: likesCtrl, users: usersCtrl } = require('./controllers');

let { auth: auth_mw} = require('./middlewares');

module.exports = function(app) {
  app.use('/api/v1', authCtrl);
  app.use('/api/v1/tweets', auth_mw, tweetsCtrl);
  app.use('/api/v1/likes', auth_mw, likesCtrl);
  app.use('/api/v1/users', auth_mw, usersCtrl);
};
