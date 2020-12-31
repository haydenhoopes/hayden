const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  path = require("path"),
  fileUpload = require('express-fileupload'),
  User = require("./models/user"),
  passport = require("passport"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash");
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

// Database Connection
mongoose.connect( process.env.MONGODB_URI, 
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
    );
  
  // Passport
  app.use(cookieParser("haydenSecretCode"));
  app.use(
    expressSession({
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
    res.locals.currentUser = req.user;
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.flashMessages = req.flash();
    next();
  });

  app.use("/", router);

  const server = app.listen(app.get("port"), () => {
      console.log(`Server running at http://localhost:${app.get("port")}`);
  }),
  io = require("socket.io")(server);
  require("./controllers/chatController")(io);