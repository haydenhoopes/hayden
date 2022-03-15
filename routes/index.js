"use strict";

const middleware = require("../custom_middleware/middleware");

const router = require("express").Router(),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes"),
  userRoutes = require("./userRoutes"),
  projectRoutes = require("./projectRoutes"),
  apiRoutes = require("./apiRoutes"),
  mangoRoutes = require("./mangoRoutes"),
  listRoutes = require("./listRoutes"),
  musicRoutes = require("./musicRoutes"),
  pineappleRoutes = require("./pineappleRoutes");
  // mangoRoutes = require('./mangoRoutes'),

  // mangoController = require("../controllers/mangoController");

// router.get("/test", mangoController.test);
// router.use("/mangoes", isAdmin, mangoRoutes);
// router.use("/subscribers", subscriberRoutes);
// router.use("/courses", courseRoutes);
router.use("/coconuts", projectRoutes);
router.use("/mangoes", mangoRoutes);
router.use("/api", apiRoutes);
router.use("/users", userRoutes);
router.use("/pineapples", middleware.isAdmin, pineappleRoutes);
router.use("/lists", listRoutes);
router.use("/music", musicRoutes);
router.use("/", homeRoutes);
router.use(errorRoutes);

module.exports = router;
