"use strict";

const router = require("express").Router(),
  homeController = require("../controllers/homeController");

router.get("/about", homeController.aboutMe);
router.get("/contact", homeController.contact);
router.get("/privacy", homeController.privacy);
router.get("/technologies", homeController.getTechs);
router.post("/technologies", homeController.postTech);
router.get("/", homeController.index);

// router.get("/chat", homeController.chat);
// router.get("/contact", homeController.contact);

module.exports = router;