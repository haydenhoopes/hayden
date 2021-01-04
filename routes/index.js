"use strict";

const router = require("express").Router(),
  userRoutes = require("./userRoutes"),
  // subscriberRoutes = require("./subscriberRoutes"),
  // courseRoutes = require("./courseRoutes"),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes"),
  mangoRoutes = require('./mangoRoutes');
  // apiRoutes = require("./apiRoutes");
  
  const isAdmin = (req, res, next) => {
    if (!res.locals.currentUser || !res.locals.currentUser.isAdmin) {
      res.render("/error/notFound");
    } else {
      next();
    }};

router.use("/users", userRoutes);
router.use("/mangoes", isAdmin, mangoRoutes);
// router.use("/subscribers", subscriberRoutes);
// router.use("/courses", courseRoutes);
// router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use(errorRoutes);

module.exports = router;
