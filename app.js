var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
//const fileUpload = require('express-fileupload');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(multipart());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(fileUpload());
require('./app/routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
    /*case 'ER_BAD_FIELD_ERROR':
          res.status(400).end();
          break;*/
    default:
      res.status(err.status || 500).end(res.locals.message);
      break;
  }
});

module.exports = app;
