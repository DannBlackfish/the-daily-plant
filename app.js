require('dotenv').config();

const path = require('path');
const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');

// Set up the database
mongoose
  .connect('mongodb://localhost/the-daily-plant', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

// Routers
const index = require('./routes/index');
const auth = require('./routes/auth');
const info = require('./routes/info');
const app = express();
require('./configs/session.config')(app);

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes middleware
app.use('/', index);
app.use('/', auth);
app.use('/', info);


// Catch missing routes and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Catch all error handler
app.use((error, req, res) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};
  // render the error page
  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;