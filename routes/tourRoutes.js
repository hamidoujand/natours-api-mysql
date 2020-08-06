let router = require("express").Router();
let tourController = require("../controllers/tourController");
//GET  all tours
router.get("/", tourController.getAllTours);

//POST create tour
router.post("/", tourController.createTour);

module.exports = router;
