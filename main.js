const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  layouts = require("express-ejs-layouts"),
  mongoose = require('mongoose'),
  path = require("path"),
  fileUpload = require('express-fileupload'),
  User = require("./models/user"),
  passport = require('passport'),
  parser = require("./api/parse"),
  cookieParser = require('cookie-parser'),
  connectFlash = require('connect-flash'),
  session = require("express-session");

require("dotenv").config();

// App Settings
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(layouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

// User Database
mongoose.connect( process.env.MONGODB_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
).catch(err => {
  console.log(err);
  res.send(err);
});

// Passport
  app.use(cookieParser("haydenSecretCode"));
  app.use(
    session({
      secret: "haydenSecretCode",
      cookie: {
        maxAge: 4000000
      },
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

// Flash Messages
app.use(connectFlash());

app.use((req, res, next) => {
  // This next line is SUPER IMPORTANT!!! It decodes the encoded data passed in from APIGateway
  if (process.env.url_prefix) {req.body = parser.decode(req.body);};
  res.locals.currentUser = req.user;
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.flashMessages = req.flash();
  res.locals.urlPrefix = process.env.url_prefix;
  next();
});

app.use("/", router);

module.exports = app; 
