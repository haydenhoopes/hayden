// Routes for lists
"use strict";

const router = require("express").Router(),
  middleware = require("../custom_middleware/middleware"),
  listController = require("../controllers/listController");

router.get("/", listController.all);
router.get("/create", listController.getCreate);
router.get("/:id", listController.getsingle);
router.post("/create", listController.postCreate);
router.post("/update", listController.postUpdate);
router.get("/:id/delete", listController.delete);
router.get("/:id/edit", listController.getUpdate);

module.exports = router;