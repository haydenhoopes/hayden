"use strict";

const router = require("express").Router(),
  homeController = require("../controllers/homeController");

router.get("/about", homeController.aboutMe);
router.get("/", homeController.index);

// router.get("/chat", homeController.chat);
// router.get("/contact", homeController.contact);

module.exports = router;