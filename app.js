var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser= require('body-parser')
const dotenv = require('dotenv');
dotenv.config();
const initializeRouting = require('./routes');
const { initializeHelpers } = require('./helper');

var app = express();
app.use(cors({
  origin: [
    "*",
    "http://localhost:3000",
    /\.usetheviews\.com$/,
  ]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

initializeRouting(app);

const buildFolder = 'build1';
app.use('/', express.static('site'));
app.use(express.static(buildFolder));
app.use('/uploaded-images', express.static('uploads'));
app.use('/*', express.static(buildFolder));
app.get('/*', function (req, res) {
  res.sendFile(__dirname + `/${buildFolder}/index.html`);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

initializeHelpers();
module.exports = app;
