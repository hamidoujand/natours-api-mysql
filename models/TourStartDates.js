let { Model, DataTypes } = require("sequelize");
let sequelize = require("../db/connection");

class StartDates extends Model {}

StartDates.init(
  {
    startDate: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, modelName: "startDate" }
);

module.exports = StartDates;
