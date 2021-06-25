"use strict";

const router = require("express").Router(),
  userController = require("../controllers/userController");

router.get("/login", userController.getLogin);
router.post("/login", userController.userLogin);
router.get("/new", userController.newUser);
router.post('/new', userController.postNewUser, userController.userLogin);
router.get('/logout', userController.logout);
router.get("/all", userController.allUsers);
router.get('/:id/edit', userController.editUser);
router.post("/:id/update", userController.updateUser);
router.get('/:id', userController.getUser);

module.exports = router;