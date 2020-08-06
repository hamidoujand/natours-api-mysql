let Tour = require("../models/Tour");

//GET all tours
let getAllTours = async (req, res, next) => {
  try {
    let allTours = await Tour.findAll({});
    res.send({
      status: "success",
      result: allTours.length,
      data: allTours,
    });
  } catch (error) {
    next(error);
  }
};

//POST create a Tour
let createTour = async (req, res, next) => {
  try {
    let newTour = await Tour.create({
      name: "hardcoded tour for testing",
      startDates: [
        { startDate: "2016-08-09 08:03:08" },
        { startDate: "2016-08-09 08:03:08" },
      ],
    });
    res.send(newTour);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTours,
  createTour,
};
