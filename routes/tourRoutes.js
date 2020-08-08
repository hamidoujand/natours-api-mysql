let router = require("express").Router();
let tourController = require("../controllers/tourController");
//GET  all tours
router.get("/", tourController.getAllTours);

//POST create tour
router.post("/", tourController.createTour);

//GET single tour
router.get("/:tourId", tourController.getSingleTour);

//DELETE single tour
router.delete("/:tourId", tourController.deleteSingleTour);
module.exports = router;
