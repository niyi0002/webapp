var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const passport = require("passport");
const flash = require('connect-flash');
var session = require('express-session');
var indexRouter = require('./routes/index');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site
var app = express();
app.use(cookieParser());
app.use(session({
  secret : 'secret',
  resave : true,
  saveUninitialized : true,
  cookies :{ secure: false },
 }));
 app.use(flash());
app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error  = req.flash('error');
next();
})
 app.use(passport.initialize());
 app.use(passport.session());
 require("./config/passport")(passport);
//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb+srv://nilay:coolpassword@cluster0.lv52f.mongodb.net/tvshow_library?retryWrites=true&w=majority';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/catalog', catalogRouter); 
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


module.exports = app;
