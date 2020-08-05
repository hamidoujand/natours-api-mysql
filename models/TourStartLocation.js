let { Model, DataTypes } = require("sequelize");
let sequelize = require("../db/connection");

class Location extends Model {}

Location.init(
  {
    startLocation: {
      type: DataTypes.GEOGRAPHY("POINT"),
    },
  },
  {
    sequelize,
    modelName: "startLocation",
  }
);

module.exports = Location;
