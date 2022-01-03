// Routes for journal
"use strict";

const router = require("express").Router(),
  middleware = require("../custom_middleware/middleware"),
  mangoController = require("../controllers/mangoController");

router.get("/", mangoController.all);
router.get("/create", mangoController.getCreate);
router.get("/:id", mangoController.getsingle);
router.post("/create", mangoController.postCreate);
router.post("/update", mangoController.postUpdate);
router.get("/:id/delete", mangoController.delete);
router.get("/:id/edit", mangoController.getUpdate);

module.exports = router;