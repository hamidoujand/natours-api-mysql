let { Model, DataTypes } = require("sequelize");
let sequelize = require("../../db/connection");

class Image extends Model {}

Image.init(
  {
    url: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "image",
  }
);

module.exports = Image;
