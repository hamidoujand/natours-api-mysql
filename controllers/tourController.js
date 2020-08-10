let { Op } = require("sequelize");
let sequelize = require("../db/connection");
//GET all tours
let getAllTours = async (req, res, next) => {
  try {
    let allTours = await sequelize.models.tour.findAll({
      where: {
        secretTour: {
          [Op.ne]: true,
        },
      },
    });
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
// GET single Tour
let getSingleTour = async (req, res, next) => {
  try {
    let tourId = req.params.tourId;
    let tour = await sequelize.models.tour.findByPk(tourId, {
      include: [
        { model: sequelize.models.location },
        { model: sequelize.models.image },
      ],
    });

    if (!tour) {
      return res.status(404).send({
        status: "failed",
        msg: "not found",
      });
    }
    res.send({
      status: "success",
      data: tour,
    });
  } catch (error) {
    next(error);
  }
};
// DELETE a single tour
let deleteSingleTour = async (req, res, next) => {
  try {
    let [deleted] = await sequelize.models.tour.destroy({
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

//UPDATE a single tour
let updateSingleTourById = async (req, res, next) => {
  try {
    //because we need to return the record back so we do the find and then update
    let tour = await sequelize.models.tour.findByPk(req.params.tourId);
    if (!tour) {
      return res.status(404).send({ status: "failed", msg: "not found" });
    }
    tour.update(req.body);
    res.send({ status: "success", data: tour });
  } catch (error) {
    next(error);
  }
};

//Update a single location
let updateSingleLocation = async (req, res, next) => {
  try {
    let tourId = req.params.tourId;
    let locationId = req.params.locationId;
    let location = await sequelize.models.location.findOne({
      where: { id: locationId, tourId: tourId },
    });
    if (!location) {
      return res.status(404).send({
        status: "failed",
        msg: "not found",
      });
    }
    //here we do the update
    await location.update({
      coordinate: { type: req.body.type, coordinates: req.body.coordinates },
    });
    res.send({
      status: "success",
      data: location,
    });
  } catch (error) {
    next(error);
  }
};
//delete a location from tour
let deleteSingleLocation = async (req, res, next) => {
  try {
    let product = await sequelize.models.location.findOne({
      where: { id: req.params.locationId, tourId: req.params.tourId },
    });
    if (!product) {
      return res.status(404).send({
        status: "failed",
        msg: "not found",
      });
    }
    await product.destroy();
    res.send({
      status: "success",
      product,
    });
  } catch (error) {
    next(error);
  }
};

//create another location
let createNewLocation = async (req, res, next) => {
  try {
    let tour = await sequelize.models.tour.findOne({
      where: { id: req.params.tourId },
      include: [sequelize.models.location],
    });
    if (!tour) {
      return res.status(404).send({
        status: "failed",
        msg: "not found",
      });
    }

    await tour.createLocation({
      coordinate: {
        type: "Point",
        coordinates: [req.body.lat * 1, req.body.lng * 1],
      },
    });
    await tour.reload();
    res.send(tour);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTours,
  createTour,
  getSingleTour,
  deleteSingleTour,
  updateSingleTourById,
  updateSingleLocation,
  deleteSingleLocation,
  createNewLocation,
};
