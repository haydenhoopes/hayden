"use strict";

const router = require("express").Router(),
  middleware = require("../custom_middleware/middleware"),
  homeController = require("../controllers/homeController");

router.get("/about", homeController.aboutMe);
router.get("/contact", homeController.contact);
router.get("/privacy", homeController.privacy);
router.get("/technologies", homeController.getTechs);
router.post("/technologies", middleware.isAdmin, homeController.postTech);
router.post("/uploadS3", middleware.isAdmin, homeController.uploadS3);
router.get("/profile", middleware.isLoggedIn, homeController.profile);
// router.get("/profile/:page", middleware.isLoggedIn, homeController.getPage);
// router.get("/profile/:page/:item", middleware.isLoggedIn, homeController.getItemFromPage);
router.get("/", homeController.index);

module.exports = router;