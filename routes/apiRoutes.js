"use strict";

const router = require("express").Router(),
  middleware = require("../custom_middleware/middleware"),
  apiController = require("../controllers/apiController");

router.get("/s/:table", apiController.scan);
router.get("/p/:table", apiController.pscan);

router.get("/g/:table/:id", apiController.get);
router.post("/u/:table", // middleware.isAdmin, 
apiController.update);
// router.get("/create", middleware.isAdmin, projectController.getCreate);
// router.get("/:id", projectController.getsingle);
// router.post("/create", middleware.isAdmin, projectController.postCreate);
// router.post("/update", middleware.isAdmin, projectController.postUpdate);
// router.get("/:id/delete", middleware.isAdmin, projectController.delete);
// router.get("/:id/edit", middleware.isAdmin, projectController.getUpdate);

module.exports = router;