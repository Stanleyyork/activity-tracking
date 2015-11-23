// SERVER.js

// APP REQUIREMENTS
var express = require('express');
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    app = express(),
    mongoose = require('mongoose'),
    User = require('./models/user'),
    Activity = require('./models/activity'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

mongoose.connect('mongodb://localhost/activity-tracking');
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FUNCTIONS
// Redirect to login page if user not signed-in
function isAuthenticated(req, res, next) {
    if (req.user){
        return next();
    }
    res.redirect('/login');
}

// ROUTES
// GET - Register
app.get('/register', function (req, res) {
    res.render('register');
});
// POST - Register
app.post('/register', function (req, res){
  User.register(new User({ username: req.body.username, coachMeProfileUrl: req.body.coachMeProfileUrl, email: req.body.email }), req.body.password,
    function (err, newUser) {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/index');
      });
    }
  );
});
// GET - User Login
app.get('/login', function (req, res){
    res.render('login');
});
// POST - User Login
app.get('/login', passport.authenticate('local'), function (req, res){
    res.redirect('/index');
});
// GET - User Log-out
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});
// GET - Activity Index
app.get('/index', function (req, res){
    console.log(req.user);
    res.render('index', req.user);
});
// GET - Activity Single
app.get('/activity/:id', function (req, res){
    app.get('activity');
});




// SERVER PORT
app.listen(3000, function(){
    console.log("Server is running");
});