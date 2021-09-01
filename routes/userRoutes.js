"use strict";

const router = require("express").Router(),
  middleware = require("../custom_middleware/middleware"),
  userController = require("../controllers/userController");

// Login
router.get("/login", userController.getLogin);
router.get("/loginWithToken", userController.loginWithToken, userController.setCookie);
router.get("/logout", userController.logout);

// Messages
router.get("/messages", userController.getMessages);
router.post("/messages", userController.postMessage);
router.post("/messages/deleteMany", userController.deleteMany);

module.exports = router;