const router = require("express").Router(),
  middleware = require("../custom_middleware/middleware"),
  musicController = require("../controllers/musicController");

router.get("/", musicController.all);
router.post("/checkYoutube", musicController.checkYoutube);

module.exports = router;