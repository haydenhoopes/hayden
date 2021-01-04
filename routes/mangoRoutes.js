"use strict";

const router = require("express").Router(),
  mangoController = require("../controllers/mangoController");

router.get("/", mangoController.mangoes);
router.get("/add", mangoController.add);
router.post("/add", mangoController.addMango);
router.get("/:id", mangoController.getSingleMango);

module.exports = router;