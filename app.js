let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let multipart = require('connect-multiparty');

let app = express();

app.use(logger('dev'));
app.use(multipart());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./app/routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  switch (err.code) {
    // knex error when we try to insert duplicate entrie
    case 'ER_DUP_ENTRY':
      res.status(409).send();
      break;
    default:
      res.status(err.status || 500).end(res.locals.message);
      break;
  }
});

module.exports = app;
