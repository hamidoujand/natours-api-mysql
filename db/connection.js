let { Sequelize } = require("sequelize");
const wkx = require("wkx");
Sequelize.GEOMETRY.prototype._stringify = function _stringify(value, options) {
  return `ST_GeomFromText(${options.escape(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`;
};
Sequelize.GEOMETRY.prototype._bindParam = function _bindParam(value, options) {
  return `ST_GeomFromText(${options.bindParam(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`;
};
Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
  return `ST_GeomFromText(${options.escape(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`;
};
Sequelize.GEOGRAPHY.prototype._bindParam = function _bindParam(value, options) {
  return `ST_GeomFromText(${options.bindParam(
    wkx.Geometry.parseGeoJSON(value).toWkt()
  )})`;
};
let sequelize = new Sequelize({
  dialect: "mysql",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DB_HOST,
});

module.exports = sequelize;
