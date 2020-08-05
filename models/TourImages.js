let { Model, DataTypes } = require("sequelize");
let sequelize = require("../db/connection");

class TourImages extends Model {}

TourImages.init(
  {
    images: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, modelName: "tourImages" }
);

module.exports = TourImages;
