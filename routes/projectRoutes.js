"use strict";

const router = require("express").Router(),
  projectController = require("../controllers/projectController");

  const isAdmin = (req, res, next) => {
    if (!res.locals.currentUser || !res.locals.currentUser.isAdmin) {
      res.render("error/notFound");
    } else {
      next();
    }};

router.get("/", projectController.all);
router.get("/create", projectController.getCreate);
router.get("/:id", projectController.getsingle);
router.post("/create", projectController.postCreate);
router.post("/update", projectController.postUpdate);
router.get("/:id/delete", projectController.delete);
router.get("/:id/edit", projectController.getUpdate);
// router.get("/add", projectController.add);
// router.get("/expenses", projectController.getExpenses);
// router.get("/income", projectController.getIncome);
// router.post("/add", projectController.addMango);
// router.get("/tithing", projectController.getTithing);
// router.get("/:id/delete", projectController.delete);
// router.post("/:id/update", projectController.updateMango);
// router.get("/:id", projectController.getSingleMango);

module.exports = router;