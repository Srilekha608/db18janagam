var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const carRouter = require('./routes/cars')
const resoureRouter = require('./routes/resource')
const addModRouter = require('./routes/addmods');
const selectorRouter = require('./routes/selector');
const Costume = require("./models/costume");
const tomjerryRouter = require("./routes/tomjerry");

var passport = require('passport'); 
var LocalStrategy = require('passport-local').Strategy; 
var app = express();
passport.use(new LocalStrategy( 
    function(username, password, done) { 
      Account.findOne({ username: username }, function (err, user) { 
        if (err) { return done(err); } 
        if (!user) { 
          return done(null, false, { message: 'Incorrect username.' }); 
        } 
        if (!user.validPassword(password)) { 
          return done(null, false, { message: 'Incorrect password.' }); 
        } 
        return done(null, user); 
      }); 
    }));
const connectionString =  process.env.MONGO_CON;
console.log(connectionString)
mongoose.connect(connectionString,{useNewUrlParser: true, useUnifiedTopology: true}); 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:')); 
db.once("open", function(){
   console.log("Connection to DB succeeded");
    recreateDB();
}); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({ 
  secret: 'keyboard cat', 
  resave: false, 
  saveUninitialized: false 
})); 
app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/resource', resoureRouter);
app.use('/tomjerry', tomjerryRouter);
app.use('/users', usersRouter);
app.use('/cars', carRouter);
app.use('/addmods', addModRouter);
app.use('/selector', selectorRouter);

var Account =require('./models/account'); 
 
passport.use(new LocalStrategy(Account.authenticate())); 
passport.serializeUser(Account.serializeUser()); 
passport.deserializeUser(Account.deserializeUser()); 
 

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


async function recreateDB(){ 
  // Delete everything 
  await Costume.deleteMany(); 
 
  let instance1 = new Costume({costume_type:"ghost",  size:'large', cost:25.4}); 
  let instance2 = new Costume({costume_type:"God",  size:'Xs', cost:24.4}); 
  let instance3 = new Costume({costume_type:"Human",  size:'small', cost:19.4}); 

  instance1.save( function(err,doc) { 
      if(err) return console.error(err); 
      console.log("First object saved") 
  });
  instance2.save( function(err,doc) { 
    if(err) return console.error(err); 
    console.log("second object saved") 
  });
  instance3.save( function(err,doc) { 
    if(err) return console.error(err); 
    console.log("third object saved") 
  });
  
} 
 


module.exports = app;