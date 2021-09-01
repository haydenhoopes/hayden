const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  layouts = require("express-ejs-layouts"),
  path = require("path"),
  fileUpload = require('express-fileupload'),
  connectFlash = require('connect-flash'),
  middleware = require("./custom_middleware/middleware"),
  cookieParser = require("cookie-parser"),
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

// Passport
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

app.use(cookieParser());

// Flash Messages
app.use(connectFlash());

//  ******     CUSTOM MIDDLEWARE     ******
app.use((req, res, next) => {
  // This next line is SUPER IMPORTANT!!! It decodes the encoded data passed in from APIGateway
  if (process.env.url_prefix) {req.body = middleware.decode(req.body);};
  // Get and verify cookies
  middleware.getCookies(req, res, next);
  res.locals.flashMessages = req.flash();
  res.locals.urlPrefix = process.env.url_prefix;
  next();
});

app.use("/", router);

module.exports = app; 
