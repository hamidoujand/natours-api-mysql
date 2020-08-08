let sequelize = require("../db/connection");
//GET all tours
let getAllTours = async (req, res, next) => {
  try {
    let allTours = await sequelize.models.tour.findAll({});
    res.send(allTours);
  } catch (error) {
    next(error);
  }
};

//POST create a Tour
let createTour = async (req, res, next) => {
  try {
    let newTour = await sequelize.models.tour.create(req.body, {
      include: [
        { model: sequelize.models.location },
        { model: sequelize.models.startDate },
      ],
    });
    res.send(newTour);
  } catch (error) {
    next(error);
  }
};

let getSingleTour = async (req, res, next) => {
  try {
    let tourId = req.params.tourId;
    let tour = await sequelize.models.tour.findByPk(tourId, {
      include: [
        { model: sequelize.models.location },
        { model: sequelize.models.image },
      ],
    });
    res.send({
      status: "success",
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};

let deleteSingleTour = async (req, res, next) => {
  try {
    let deleted = await sequelize.models.tour.destroy({
      where: {
        id: req.params.tourId,
      },
    });
    if (deleted) {
      res.send({
        status: "success",
        msg: "deleted successfully",
        deleted,
      });
    } else {
      res.status(404).send({
        status: "failed",
        msg: "not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTours,
  createTour,
  getSingleTour,
  deleteSingleTour,
};
