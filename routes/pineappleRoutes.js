// Routes for journal
"use strict";

const router = require("express").Router(),
  middleware = require("../custom_middleware/middleware"),
  pineappleController = require("../controllers/pineappleController");

router.get("/", pineappleController.all);
router.get("/create", pineappleController.getCreate);
router.get("/translate", pineappleController.translator);
router.post("/translate", pineappleController.decode);
router.get("/:id", pineappleController.getsingle);
router.post("/create", pineappleController.postCreate);
router.post("/update", pineappleController.postUpdate);
router.get("/:id/delete", pineappleController.delete);
router.get("/:id/edit", pineappleController.getUpdate);

module.exports = router;