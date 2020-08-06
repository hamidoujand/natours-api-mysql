let { Model, DataTypes } = require("sequelize");
let sequelize = require("../db/connection");

class Tour extends Model {}

Tour.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
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
    // ratingsAverage: {
    //   type: DataTypes.FLOAT,
    //   defaultValue: 4.5,
    //   validate: {
    //     min: { args: 1, msg: "ratingsAverage can not be bellow 1" },
    //     max: { args: 5, msg: "ratingsAverage can not be bellow 5" },
    //   },
    // },
    // ratingsQuantity: {
    //   type: DataTypes.FLOAT,
    //   defaultValue: 0,
    // },
    // price: {
    //   type: DataTypes.FLOAT,
    //   allowNull: false,
    //   validate: {
    //     notNull: { args: true, msg: "price is required field" },
    //   },
    // },
    // duration: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   validate: {
    //     notNull: { args: false, msg: "duration is required" },
    //   },
    // },
    // priceDiscount: {
    //   type: DataTypes.FLOAT,
    //   validate: {
    //     isItBelowThePrice(value) {
    //       if (value > this.price) {
    //         throw new Error(
    //           "Price discount can not be greater than price itself"
    //         );
    //       }
    //     },
    //   },
    // },
    // summary: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: { args: true, msg: "the summary field is required" },
    //     notNull: { args: true, msg: "summary is required field" },
    //   },
    // },
    // description: { type: DataTypes.STRING },
    // imageCover: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     notEmpty: { args: true, msg: "image cover can not be empty" },
    //     notNull: { args: true, msg: "image cover is required field" },
    //   },
    // },
    // maxGroupSize: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   validate: {
    //     notNull: {
    //       args: true,
    //       msg: "maxGroupSize is a required field",
    //     },
    //   },
    // },
    // difficulty: {
    //   type: DataTypes.STRING,
    //   validate: {
    //     isIn: {
    //       args: [["difficult", "easy", "medium"]],
    //       msg:
    //         "value of difficulty can only be 'difficult' , 'easy' , 'medium'",
    //     },
    //   },
    // },
    // secretTour: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },

    // startLocation: {
    //   type: DataTypes.GEOMETRY("POINT"),
    // },
  },
  { sequelize, modelName: "tour" }
);

module.exports = Tour;
