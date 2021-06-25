"use strict";

const router = require("express").Router(),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes"),
  userRoutes = require("./userRoutes"),
  projectRoutes = require("./projectRoutes"),
  mangoRoutes = require('./mangoRoutes'),

  mangoController = require("../controllers/mangoController");

  
  const isAdmin = (req, res, next) => {
    if (!res.locals.currentUser || !res.locals.currentUser.isAdmin) {
      res.render("error/notFound");
    } else {
      next();
    }};

// router.get("/test", mangoController.test);
// router.use("/mangoes", isAdmin, mangoRoutes);
// router.use("/subscribers", subscriberRoutes);
// router.use("/courses", courseRoutes);
router.use("/coconuts", projectRoutes);
router.use("/users", userRoutes);
router.use("/", homeRoutes);
router.use(errorRoutes);

module.exports = router;
