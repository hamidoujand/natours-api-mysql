let { Model, DataTypes } = require("sequelize");
let sequelize = require("../db/connection");

class Tour extends Model {}

Tour.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { args: true, msg: "name of tour is required" },
        notEmpty: { args: true, msg: "name of tour can not be empty" },
        len: {
          args: [10, 40],
          msg: "name of tour must be between 10 and 40 character length",
        },
      },
    },
    ratingsAverage: {
      type: DataTypes.FLOAT,
      defaultValue: 4.5,
      validate: {
        min: { args: 1, msg: "ratingsAverage can not be bellow 1" },
        max: { args: 5, msg: "ratingsAverage can not be bellow 5" },
      },
    },
  },
  { sequelize, modelName: "tour" }
);

module.exports = Tour;
