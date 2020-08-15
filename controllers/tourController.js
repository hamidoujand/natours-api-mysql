let { Op, Sequelize } = require("sequelize");
let sequelize = require("../db/connection");
const router = require("../routes/tourRoutes");
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
      let err = new Error("tour not found");
      err.statusCode = 404;
      err.status = "failed";
      return next(err);
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
      let error = new Error("not found");
      error.statusCode = 404;
      error.status = "failed";
      return next(error);
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
      let error = new Error("not found");
      error.statusCode = 404;
      error.status = "failed";
      return next(error);
    }
    await tour.update(req.body);
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
      let error = new Error("not found");
      error.statusCode = 404;
      error.status = "failed";
      return next(error);
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
      let error = new Error("not found");
      error.statusCode = 404;
      error.status = "failed";
      return next(error);
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
      let error = new Error("not found");
      error.statusCode = 404;
      error.status = "failed";
      return next(error);
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

let getToursNear = async (req, res, next) => {
  try {
    let [lat, lng] = req.params.latLng.split(",");
    let distance = req.params.distance;
    //first we create the location POINT that user is
    let location = Sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`);
    let allTours = await sequelize.models.tour.findAll({
      attributes: [
        [
          sequelize.fn(
            "ST_Distance_Sphere",
            sequelize.literal("startLocation"),
            location
          ),
          "distance",
        ],
        "name",
      ],
      where: Sequelize.where(
        Sequelize.fn(
          "ST_Distance_Sphere",
          Sequelize.literal("startLocation"),
          location
        ),
        { [Op.lte]: distance }
      ),
    });
    res.send(allTours);
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
  getToursNear,
};
