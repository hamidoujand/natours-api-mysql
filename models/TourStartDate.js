let { DataTypes, Model } = require("sequelize");
let sequelize = require("../db/connection");

class StartDate extends Model {}

StartDate.init(
  {
    startDate: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, modelName: "startDate" }
);

module.exports = StartDate;
