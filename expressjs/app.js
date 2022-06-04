var createError = require('http-errors');
var express = require('express');
// session
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.render('error');
});

// session
app.use(session({
  secret: 'some secret'
  cookie: { maxAge: 3000};
  saveUninitialized: false;
}));

app.post('login', (req, res)) => {
  console.log(req.sessionID);
  const { username, password} = req.body;
  if (username && password) {
    if (req.session.authenticated) {
      res.json(req.session);
    } else {
      if (password=== '123') {
        req.session.authenticated = true;
        req.session.user = {
          username, password
        };
      } else {
        res.statuts(403).json({msg: 'Bad credentials'});
      }
    }
  } else res.statuts(403).json({msg: 'Bad credentials'});
  res.send(200);
};

module.exports = app;


