let router = require("express").Router();
let tourController = require("../controllers/tourController");
//GET  all tours
router.get("/", tourController.getAllTours);

module.exports = router;
