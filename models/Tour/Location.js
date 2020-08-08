let { Model, DataTypes } = require("sequelize");
let sequelize = require("../../db/connection");

class Location extends Model {}

Location.init(
  {
    coordinate: {
      type: DataTypes.GEOMETRY("POINT"),
    },
  },
  { sequelize, modelName: "location" }
);

module.exports = Location;
