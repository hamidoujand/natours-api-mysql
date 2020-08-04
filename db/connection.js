let { Sequelize } = require("sequelize");

let sequelize = new Sequelize({
  dialect: "mysql",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DB_HOST,
});
sequelize.authenticate().then((val) => console.log("DB in the House!"));
module.exports = sequelize;
